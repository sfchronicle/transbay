/*

Uses the Google Drive API to parse Google Doc 
with ArchieML generate JSON file

Sheets must be "published to web" before they
can be accessed by this task

Run `grunt docs` to run task

*/


var async = require("async");
var archieml = require('archieml');
var htmlparser = require('htmlparser2');
var Entities = require('html-entities').AllHtmlEntities;
var url = require('url');
var google = require('googleapis');
var project = require("../project.json");
var credentials = require( process.env.HOME + '/.credentials.json');



var lowerCase = function(str) {
  return str.replace(/\s+/g, '_').toLowerCase();
};


module.exports = function(grunt) {

  grunt.registerTask('docs', 'Parses Google Doc and downloads as JSON', function() {

    var docKeys = project.docsID;

    if(!credentials.client_id || !credentials.secret_id) {
      throw new Error('Missing client_id or secret_id');
    };

    if(!docKeys) {
      throw new Error('Missing Google Doc ID');
    };

    var OAuth2 = google.auth.OAuth2;

    oauth2Client = new OAuth2(credentials.client_id, credentials.secret_id);
    gDrive = google.drive({ version: 'v3', auth: oauth2Client });
    oauth2Client.setCredentials(credentials.refresh_token);


    var done = this.async();

    async.each(docKeys, function(key) {

      gDrive.files.export({ fileId: key, mimeType: 'text/html'}, function (err, docHtml) {
       
        var handler = new htmlparser.DomHandler(function (error, dom) {
          var tagHandlers = {
            _base: function (tag) {
              var str = '';
              tag.children.forEach(function (child) {
                if (func = tagHandlers[child.name || child.type]) str += func(child);
              });
              return str;
            },
            text: function (textTag) {
              return textTag.data;
            },
            span: function (spanTag) {
              return tagHandlers._base(spanTag);
            },
            p: function (pTag) {
              return tagHandlers._base(pTag) + '\n';
            },
            a: function (aTag) {
              var href = aTag.attribs.href;
              if (href === undefined) return '';

              // extract real URLs from Google's tracking
              // from: http://www.google.com/url?q=http%3A%2F%2Fwww.sfchronicle.com...
              // to: http://www.sfchronicle.com...
              if (aTag.attribs.href && url.parse(aTag.attribs.href, true).query && url.parse(aTag.attribs.href, true).query.q) {
                href = url.parse(aTag.attribs.href, true).query.q;
              }

              var str = '<a href="' + href + '">';
              str += tagHandlers._base(aTag);
              str += '</a>';
              return str;
            },
            li: function (tag) {
              return '* ' + tagHandlers._base(tag) + '\n';
            }
          };

          ['ul', 'ol'].forEach(function (tag) {
              tagHandlers[tag] = tagHandlers.span;
          });
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (tag) {
              tagHandlers[tag] = tagHandlers.p;
          });

          var body = dom[0].children[1];
          var parsedText = tagHandlers._base(body);

          // Convert html entities into the characters as they exist in the google doc
          var entities = new Entities();
          parsedText = entities.decode(parsedText);

          // Remove smart quotes from inside tags
          parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
            return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
          });
    
          var parsed = archieml.load(parsedText);

          gDrive.files.get({ fileId:key }, function (err, doc) {
            var doc_title = doc.name;
            var filename = "data/" + lowerCase(doc_title) + ".json";
            grunt.file.write(filename, JSON.stringify(parsed, null, 2));
          });

        });

        var parser = new htmlparser.Parser(handler);
        parser.write(docHtml);
        parser.done();
        grunt.log.ok();
        
      });
    }, done);
  });
};