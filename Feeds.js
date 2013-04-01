// This call must happen before jQuery is ready, or it destroys the
// whole page.  This is insane.
google.load("feeds", "1");

$(function() {
	var feed_urls;
	var feed_entries = [];
	var container = $('#container');
	
	function parseFeed(url, callback) {
		(new google.feeds.Feed(url)).load(callback);
	}

	function addFeed(feed) {
		var new_entries = feed.entries;
		new_entries.forEach(function(entry) {
			if(entry.publishedDate === '') {
				entry.publishedDate = (new Date(0)).toString();
			}
		});
		feed_entries = feed_entries.concat(new_entries);
		feed_entries.sort(function(a,b) {
			var aDateStr = a.publishedDate;
			var aDate = new Date(aDateStr);

			var bDateStr = b.publishedDate;
			var bDate = new Date(bDateStr);
			return bDate - aDate;
		});
		refreshFeeds();
	};

	function refreshFeeds() {
		container.text('');
		feed_entries.forEach(function(entry) {
			var entry_block = $('<div>');
			var entry_link = $('<a>');
			entry_link.attr('href',entry.link);
			var entry_header = $('<h2>');
			entry_header.text(entry.title);
			entry_link.append(entry_header);
			entry_block.append(entry_link);
			var entry_content = $('<div>');
			entry_content.html(entry.content);
			entry_block.append(entry_content);
			entry_block.appendTo(container);
		});
	};

	Feeds = function Feeds(feeds) {
		feed_urls = feeds;
	};
	
	google.setOnLoadCallback(function() {
		feed_urls.forEach(function(url) {
			parseFeed(url,function(result) {
				if(result.error) return;
				addFeed(result.feed);
			});
		});
	});
});
