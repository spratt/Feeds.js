$(function() {
	var feed_entries = [];
	var container = $('#container');
	
	// The following function taken from:
	// http://stackoverflow.com/questions/226663/parse-rss-with-jquery
	function parseFeed(url, callback) {
		var req_url = document.location.protocol;
		req_url += '//ajax.googleapis.com/ajax/services/feed/load';
		req_url += '?v=1.0&num=10&callback=?&q=';
		req_url += encodeURIComponent(url);
		$.ajax({
			url: req_url,
			dataType: 'json',
			success: function(data) {
				callback(data.responseData.feed);
			}
		});
	}

	function addFeed(feed) {
		console.dir(feed.entries);
		feed_entries = feed_entries.concat(feed.entries);
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
	
	window.Feeds = function Feeds(feeds) {
		feeds.forEach(function(url) {
			parseFeed(url,function(feed) {
				addFeed(feed);
			});
		});
	};
});
