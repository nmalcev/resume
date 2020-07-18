(function(ENV){
  var PostViewer = Backside.extend(function(conf){
    Backside.View.call(this, conf);
  }, Backside.View);

  PostViewer.prototype.className = 'postviewer';
  PostViewer.prototype.stack = []; // stack for opened popups
  // {Bool} conf.destroyOnClose
  PostViewer.prototype.initialize = function(conf){
    if(conf.el){
      this.el = conf.el;
    }else{
      this.el = document.createElement(conf.tagName || 'div');
      this.el.className = this.className + (conf.className ? ' ' + conf.className : '');
    }

    this.render(conf);
    this.el.style.display = 'none';
    // this.el.setAttribute('tabindex', 0);
    this.$heap = conf.heap || document.getElementById('node-heap') || document.body;
    this.$heap.appendChild(this.el);

    this.onOpen = conf.onopen || function(){};
    this.onClose = conf.onclose || function(){};
    this.destroyOnClose = conf.destroyOnClose;
    if(conf.model) this.model = conf.model; 
    

    this.listen('change:start', function(start, m){
      // console.log('[TRIGGER] %s', start);
      var   items = m.get('items'),
          data;

      if(data = items[start]){
        this.controls.content.innerHTML = data.content;
        setTimeout(function(){
          this.controls.form.scrollTop = 0;
        }.bind(this), 100);
      } 
    });
  }
  PostViewer.prototype.render = function(conf){
    this.controls = {};
    this.el.innerHTML = 
    '<form data-co="form" class="postviewer-wrap" tabindex="0">' +
      '<div class="postviewer-inner" data-co="content">' +
      '</div>' +
      '<div class="postviewer-panel">' +
        '<button type="reset" class="postviewer-fixclose">' +
          '<svg class="postviewer-svgi" width="48" height="48" viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            '<line x1="-0.71" y1="0.71" x2="0.71" y2="-0.71" stroke-width="0.1"/>' +
            '<line x1="-0.71" y1="-0.71" x2="0.71" y2="0.71" stroke-width="0.1"/>' +
          '</svg>' +
        '</button>' +
        '<button type="submit" class="postviewer-fixnext">' +
          '<svg class="postviewer-svgi" width="48" height="96" viewBox="-1 -1 1 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            '<line x1="-0.71" y1="-0.71" x2="-0.01" y2="0" stroke="#fff" stroke-width="0.05"/>' +
            '<line x1="-0.71" y1="0.71" x2="-0.01" y2="0" stroke="#fff" stroke-width="0.05"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
    '</form>' +
    '';
    this.bindByData(this.el);
    // conf.events && this._bindEvents(conf.events);
    this._bindEvents(this.events);
  };
  PostViewer.prototype.events = {
    'form submit': function(e){
      e.preventDefault();
      this.next();
    },
    'form reset': function(e){
      e.preventDefault();
      this.close();

    },
    'form keydown': function(e){
      if(e.keyCode == 27){
        this.close(); 
      }else if(e.keyCode == 39){ // Right
        this.next();
      }else if(e.keyCode == 37){ // Left
        this.prev();
      }
      // console.log(e.keyCode);
    },
  };
  PostViewer.prototype.next = function(){
    var   start = this.model.get('start') + 1,
        items = this.model.get('items');

    if(items.length <= start){
      start = 0; 
    }
    this.model.change('start', start);
  };
  PostViewer.prototype.prev = function(){
    var   start = this.model.get('start') - 1,
        items = this.model.get('items');

    if(start < 0){
      start = items.length - 1; 
    }
    this.model.change('start', start);
  };
  PostViewer.prototype.remove = function(){
    this.off();
    this.el.remove();
    this.model && this.model.off();
    // Remove popup from stack
    var stackPos = this.stack.indexOf(this);
    stackPos != -1 && this.stack.splice(stackPos, 1);

    return this;
  };
  PostViewer.prototype.open = function(start){
    this.model.change('start', start);
    setTimeout(function(){
      this.controls.form.focus();
    }.bind(this), 100)

    // this.onOpen(this);
    document.documentElement.style.overflow = 'hidden';
    document.body.overflow = 'hidden';
    this.el.style.display = '';
    this.stack.push(this);
  };
  PostViewer.prototype.close = function(status){
    this.onClose(this, status)
    this.el.style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.overflow = '';
    this.destroyOnClose && this.remove();
  };
  PostViewer.prototype._bindEvents = function(events){
    var   pos, controlName, eventName;

    for(var key in events){
      pos = key.indexOf(' ');
      
      if(pos != -1){
        eventName = key.substr(pos + 1);
        controlName = key.substr(0, pos);

        if(this.controls[controlName]){
          this.controls[controlName]['on' + eventName] = events[key].bind(this);
        }
      }
    }
  };
  ENV.PostViewer = PostViewer;
}(this));

var posts = new Backside.Model({
  items: [
{
  content:
`<div class="postcontent">
  <section class="postblock">
    <h3 class="postheader1 offset1">Seat Map Plugin</h3>
    <section class="offset2">
      <p class="post-article">The SeatMap Plugin is a js widget that is used to select and book airplane seats. This plugin integrates into the web applications of Amadeus clients. The goal of the mission was to migrate the application to the new backend API.</p>
      <p class="post-article">I suggested an optimal solution for implementing the new API in an existing application. This solution reduced the development time and reduced the number of UI regression.</p>
      <p class="post-article">One of the main contributions (as well as the most difficult part) to this work was the following standards and requirements of Amadeus.</p>
    </section>
    <table class="postgrid">
      <tbody>
        
        <tr>
          <td>Time period:</td>
          <td>Winter 2019-2020</td>
        </tr>
        <tr>
          <td>Technologies:</td>
          <td>
            <ul class="floatenum">
              <li>Webpack</li>
              <li>Axios</li>
              <li>Babel</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <section class="postblock __typea">
    <img class="postimage" src="assets/portfolio/smp1.jpg"></img>
    <img class="postimage" src="assets/portfolio/smp2.jpg"></img>
  </section>
</div>`,
  tile: 'assets/portfolio/smp1.jpg'
},

{
  content:
`<div class="postcontent">
  <section class="postblock">
    <h3 class="postheader1 offset1">A Solid social application</h3>
    <section class="offset2">
      <p class="post-article">A distributed social network application on top of Solid conventions and tools. In the scope of my final education project I have developed a single page application on Angular 7.</p>
    </section>
    <table class="postgrid">
      <tbody>
        <tr>
          <td>Location:</td>
          <td><a href="https://github.com/nmalcev/reviewapp" target="_blank">Github</a></td>
        </tr>
        <tr>
          <td>Time period:</td>
          <td>Winter 2018-2019</td>
        </tr>
        <tr>
          <td>Technologies:</td>
          <td>
            <ul class="floatenum">
              <li>Angular 7</li>
              <li>Solid</li>
              <li>Bootstrap</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <section class="postblock __typea">
    <img class="postimage" src="assets/portfolio/reviewapp1.png"></img>
    <img class="postimage" src="assets/portfolio/reviewapp2.png"></img>
    <img class="postimage" src="assets/portfolio/reviewapp3.png"></img>
    <img class="postimage" src="assets/portfolio/reviewapp4.png"></img>
  </section>
</div>`,
  tile: 'assets/portfolio/reviewapp4.png'
},
  {
    content:
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Dr. Web Linux Console</h3>\
    <section class="offset2">\
      <p class="post-article">Dr. Web Linux Web Console is a web admin panel for antivirus server products. This single-page application comes with the <a href="https://products.drweb.com/linux" target="_blank">Dr.Web Anti-virus for Linux</a></p>\
      <p class="post-article">Web application supports real-time multi-user access.</p>\
<p class="post-article">For technical requirements, I had to maintain compatibility with IE 10 and some older versions of Firefox from commercial Linux distributions. I could not use a WebSocket connection (because the webserver did not support it). I used long polling with Server-Sent Events for communication and I need to maintain a request queue to load sensitive user data.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="https://download.geo.drweb.com/pub/drweb/unix/server/11.0/documentation/html/en/index.html?dw_9_web_interface_main.htm" target="_blank">Product manual</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2017 year</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>Angular.js</li>\
              <li>Require.js</li>\
              <li>Stylus</li>\
              <li>HTML5/CSS3</li>\
              <li>Server Sent Events (SSE)</li>\
              <li>Responsive Layout</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/webconsole6.png"></img>\
    <img class="postimage" src="assets/portfolio/webconsole3.png"></img>\
    <img class="postimage" src="assets/portfolio/webconsole4.png"></img>\
    <img class="postimage" src="assets/portfolio/webconsole8.png"></img>\
    <img class="postimage" src="assets/portfolio/webconsole10.png"></img>\
    <img class="postimage" src="assets/portfolio/webconsole12.png"></img>\
    <img class="postimage" src="assets/portfolio/webconsole13.png"></img>\
  </section>\
</div>',    
    tile: 'assets/portfolio/webconsole3.png', 
  }, 
  {
    content: 
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Y-Tracker</h3>\
    <section class="offset2">\
      <p class="post-article">Y-Tracker is a cyber intelligence platform for corporate customers of Dr. Web, that aggregate sensitive information about cyber crime. <br/>I have completed all fronted tasks.</p>\
      <p class="post-article">Key features:</p>\
      <ul class="postlist">\
        <li>Data visualization at charts, diagrams and vector scalable maps;</li>\
        <li>Wysiwyg editor for documents;</li>\
        <li>Supporting of different types of user profiles.</li>\
      </ul>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Time period:</td>\
          <td>2017 year</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>Angular.js</li>\
             <li>jQuery</li>\
              <li>SVG, D3.js</li>\
              <li>Require.js</li>\
              <li>Stylus</li>\
              <li>HTML5/CSS3</li>\
              <li>Responsive Layout</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/ytracker1.jpg"></img>\
    <img class="postimage" src="assets/portfolio/ytracker2.jpg"></img>\
    <img class="postimage" src="assets/portfolio/ytracker3.jpg"></img>\
    <img class="postimage" src="assets/portfolio/ytracker4.jpg"></img>\
    <img class="postimage" src="assets/portfolio/ytracker5.jpg"></img>\
  </section>\
</div>',    
    tile: 'assets/portfolio/ytracker1.jpg', 
  }, 
  {
    content: 
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Netmarks</h3>\
    <section class="offset2">\
      <p class="post-article">Netmarks is a tree-style bookmark manager for the Chrome browser. This is my personal project.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="https://chrome.google.com/webstore/detail/netmarks-bookmarks-menu/boepmphdpbdnficfifejnkejlljcefjb" target="_blank">Chrome Web store</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2011-2017 years</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>HTML5/CSS3</li>\
              <li>Chrome Api</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/netmarks3.png"></img>\
    <img class="postimage" src="assets/portfolio/netmarks1.jpg"></img>\
  </section>\
</div>',
    tile: 'assets/portfolio/netmarks3.png', 
  }, 
{
  content:
`<div class="postcontent">
  <section class="postblock">
    <h3 class="postheader1 offset1">EMIAS</h3>
    <p class="post-article">I developed several single-page applications on Angular.js and Angular for medical institutions to allow medical staff to manage patient appointments. All of them belong to the medical records management system for the Moscow medical information system (EMIAS).</p>
    <table class="postgrid">
      <tbody>
        <tr>
          <td>Time period:</td>
          <td>Winter 2017-2018</td>
        </tr>
      </tbody>
    </table>
  </section>
  <section class="postblock __typea">
    <img class="postimage" src="assets/portfolio/emias/emias2.jpg"></img>
    <img class="postimage" src="assets/portfolio/emias/emias3.jpg"></img>
    <img class="postimage" src="assets/portfolio/emias/emias4.jpg"></img>
    <img class="postimage" src="assets/portfolio/emias/emias5.jpg"></img>
    <img class="postimage" src="assets/portfolio/emias/emias6.jpg"></img>
    <img class="postimage" src="assets/portfolio/emias/emias1.jpg"></img>
  </section>
</div>`,
  tile: 'assets/portfolio/emias/emias4.jpg'
},
  {
    content: 
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Quest games and voting contests</h3>\
    <section class="offset2">\
      <p class="post-article">At fotostrana.ru I worked as a front-developer for several entertainment projects based on game mechanics such as quests and user votings.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="http://www.fotostrana.ru" target="_blank">www.fotostrana.ru</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2014 year</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>Backbone.js</li>\
              <li>Require.js</li>\
              <li>SASS</li>\
              <li>HTML5/CSS3</li>\
              <li>Responsive Layout</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/contest1.jpg"></img>\
    <img class="postimage" src="assets/portfolio/clan1.jpg"></img>\
    <img class="postimage" src="assets/portfolio/clan2.jpg"></img>\
    <img class="postimage" src="assets/portfolio/clan4.jpg"></img>\
  </section>\
</div>',
    tile: 'assets/portfolio/contest1.jpg',  
  }, {
    content: 
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Ticket admin panel and admin panel of massive failures</h3>\
    <section class="offset2">\
      <p class="post-article">This is an internal web service for the support department</p> \
      <p class="post-article">Admin panel is used to communicate with users of the social network. It provides a simple access to the information about users, user\'s requests, frequently asked questions. The same type of user requests can be combined into one "massive failure" with the creation of tasks in Redmine, which can be assigned to testers or developers.</p>\
      <p class="post-article">I have completed all fronted tasks.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="http://www.fotostrana.ru" target="_blank">www.fotostrana.ru</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2013-2014 years</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>HTML5/CSS3</li>\
              <li>Responsive Layout</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/ticket-admin1.png"></img>\
    <img class="postimage" src="assets/portfolio/ticket-admin2.png"></img>\
    <img class="postimage" src="assets/portfolio/ticket-admin3.png"></img>\
    <img class="postimage" src="assets/portfolio/ticket-admin4.png"></img>\
  </section>\
</div>',
    tile: 'assets/portfolio/ticket-admin1.png',
  }, 
  {
    content: 
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Differents elements of UI fotostrana.ru</h3>\
    <section class="offset2">\
      <p class="post-article">Moderation popups, blocking pages and e.t.c.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="http://www.fotostrana.ru" target="_blank">www.fotostrana.ru</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2013-2014 years</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>HTML5/CSS3</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/fs_interface1.png"></img>\
    <img class="postimage" src="assets/portfolio/fs_interface2.jpg"></img>\
    <img class="postimage" src="assets/portfolio/fs_interface3.jpg"></img>\
    <img class="postimage" src="assets/portfolio/fs_interface4.png"></img>\
  </section>\
</div>',
    tile: 'assets/portfolio/fs_interface1.png',
  }, 
  {
    content: 
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Finance page of user profile on fotostrana.ru</h3>\
    <section class="offset2">\
      <p class="post-article">A section in the user\'s profile with detailed information about the user\'s payments. The user interface provides various approaches to buying currency in a social network.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="http://www.fotostrana.ru" target="_blank">www.fotostrana.ru</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2013-2014 years</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>HTML5/CSS3</li>\
              <li>Responsive Layout</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/finpopup2.png"></img>\
    <img class="postimage" src="assets/portfolio/finpopup3.png"></img>\
    <img class="postimage" src="assets/portfolio/autopay1.png"></img>\
    <img class="postimage" src="assets/portfolio/fotocheck.png"></img>\
    <img class="postimage" src="assets/portfolio/finroom.png"></img>\
    <img class="postimage" src="assets/portfolio/finroom2.png"></img>\
  </section>\
</div>',
    tile: 'assets/portfolio/finpopup2.png',
  },
{
  content:
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Web application for image moderation at fotostrana.ru</h3>\
    <section class="offset2">\
      <p class="post-article">In 2013, I developed a special web application to automate the image moderation process.</p>\
      <p class="post-article">All uploaded public images can be safely verified by volunteers. Volunteers are rewarded by gifts and scores for the correct results.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="http://www.fotostrana.ru" target="_blank">www.fotostrana.ru</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2013 year</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>HTML5/CSS3</li>\
              <li>Responsive Layout</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/imoderator1.jpg"></img>\
    <img class="postimage" src="assets/portfolio/imoderator2.jpg"></img>\
  </section>\
</div>',
  tile: 'assets/portfolio/imoderator1.jpg',
}, {
  content:
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">www.blik-cleaning.ru</h3>\
    <section class="offset2">\
      <p class="post-article">The website for the cleaning company was built on a WordPress CMS.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="http://www.blik-cleaning.ru" target="_blank">www.blik-cleaning.ru</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2013 year</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>HTML5/CSS3</li>\
              <li>WordPress</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/cleaning.jpg"></img>\
    <img class="postimage" src="assets/portfolio/cleaning1.jpg"></img>\
  </section>\
</div>',
  tile: 'assets/portfolio/cleaning.jpg',
}, {
  content:
'<div class="postcontent">\
  <section class="postblock">\
    <h3 class="postheader1 offset1">Web site promalp.name</h3>\
    <section class="offset2">\
      <p class="post-article">Web site for a building company.</p>\
    </section>\
    <table class="postgrid">\
      <tbody>\
        <tr>\
          <td>Location:</td>\
          <td><a href="http://www.promalp.name" target="_blank">www.promalp.name</a></td>\
        </tr>\
        <tr>\
          <td>Time period:</td>\
          <td>2013 year</td>\
        </tr>\
        <tr>\
          <td>Technologies:</td>\
          <td>\
            <ul class="floatenum">\
              <li>jQuery</li>\
              <li>HTML5/CSS3</li>\
              <li>Node.js (Express)</li>\
            </ul>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
  </section>\
  <section class="postblock __typea">\
    <img class="postimage" src="assets/portfolio/promalp1.jpg"></img>\
  </section>\
</div>',
  tile: 'assets/portfolio/promalp1.jpg',
}

],
  start: 0,
});

var postViewer = new PostViewer({
  model: posts,
});
var $previews = document.querySelector('.co-preview-list');
$previews.appendChild(Cr.list(posts.get('items'), function(data, i){
  return Cr('div', 'preview').
    data('open', i).
    use(function(n){
      n.root.style.backgroundImage = 'url(%s)'.replace('%s', data.tile);
    }).
    prop('onclick', function(){
      postViewer.open(i);
    }).
    append('div', 'preview_zoom').parent().append('div', 'preview_zoom-inner').append('span', 'preview_zoom-label', 'View');
}));


