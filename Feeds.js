// This call must happen before jQuery is ready, or it destroys the
// whole page.  This is insane.
google.load("feeds", "1");

$(function() {
	var feed_groups = [];
	var container = $('#content');
	var toc = $('#toc');
	
	function parseFeed(url, callback) {
		var feed = new google.feeds.Feed(url)
		feed.includeHistoricalEntries();
		feed.setNumEntries(10);
		feed.load(callback);
	}

	function addFeed(group,feed) {
		var new_entries = feed.entries;
		new_entries.forEach(function(entry) {
			if(entry.publishedDate === '') {
				entry.publishedDate = (new Date(0)).toString();
			}
			entry.feedName = feed.title;
		});
		group.entries = group.entries.concat(new_entries);
		group.entries.sort(function(a,b) {
			var aDateStr = a.publishedDate;
			var aDate = new Date(aDateStr);

			var bDateStr = b.publishedDate;
			var bDate = new Date(bDateStr);
			return bDate - aDate;
		});
		refreshFeeds();
	};

	function buildTOC(group) {
		var toc_entry = $('<li>');
		var toc_link = $('<a>');
		toc_link.attr('href','#'+group.name);
		toc_link.text(group.name);
		toc_link.appendTo(toc_entry);
		toc_entry.appendTo(toc);
	}

	function buildFeed(group) {
		var group_header = $('<h2>');
		var group_anchor = $('<a>');
		group_anchor.attr('name',group.name);
		group_anchor.text(group.name);
		group_anchor.appendTo(group_header);
		group_header.appendTo(container);
		group.entries.forEach(function(entry) {
			buildEntry(entry,group);
		});
	}

	function buildEntry(entry,group) {
		var entry_block = $('<div>');
		entry_block.addClass('spaced');
		var entry_link = $('<a>');
		entry_link.attr('href',entry.link);
		var entry_header = $('<h3>');
		entry_header.addClass('inline');
		entry_header.text(entry.title);
		entry_link.append(entry_header);
		entry_block.append(entry_link);
		if(group.feeds.length > 1) {
			var entry_source = $('<h4>');
			entry_source.addClass('inline');
			entry_source.text('(' + entry.feedName + ')');
			entry_block.append(entry_source);
		}
		if(entry.author !== '' && entry.author !== 'editors') {
			var entry_author = $('<div>');
			entry_author.text('By: ' + entry.author);
			entry_block.append(entry_author);
		}
		var entry_content = $('<div>');
		entry_content.html(entry.content);
		entry_block.append(entry_content);
		entry_block.appendTo(container);
	}

	function refreshFeeds() {
		container.text('');
		toc.text('');
		feed_groups.forEach(function(group) {
			buildTOC(group);
			buildFeed(group);
		});
	};

	Feeds = function Feeds(feeds) {
		feed_groups = feeds;
		feed_groups.forEach(function(group) {
			group.entries = [];
		});
	};
	
	google.setOnLoadCallback(function() {
		feed_groups.forEach(function(group) {
			group.feeds.forEach(function(url) {
				parseFeed(url,function(result) {
					if(result.error) return;
					addFeed(group,result.feed);
				});
			});
		});
	});
});
