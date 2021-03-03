$(document).ready(function($) {

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    $msnry;

  mobileMenu(w);
  mobileFooterMenu(w);

  $(window).on('resize', function(event) {
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    mobileMenu(w);
    mobileFooterMenu(w);

    if($('.js-using-snt').length){
      if(w > 767){
        if($msnry == null){
          $msnry = $('.js-items').masonry({
            itemSelector: '.js-item'
          });
          $msnry.masonry('layout');
        }
      }else{
        if($msnry != null){
          $msnry.masonry('destroy');
          $msnry = null;
        }
      }
    }

  });

  $('.js-language-selector').on('mouseover', function (event) {
    event.preventDefault();
    $('.js-language-selector-list').removeClass('invisible opacity-0 pointer-events-none scale-95 mb-12');
    $('.js-language-selector-trigger').addClass('bg-black text-white');
  });
  $('.js-language-selector').on('mouseleave', function (event) {
    event.preventDefault();
    $('.js-language-selector-list').addClass('invisible opacity-0 pointer-events-none scale-95 mb-12');
    $('.js-language-selector-trigger').removeClass('bg-black text-white');
  });

  $('.js-using-snt').imagesLoaded( function() {
    if(w > 767){
      $msnry = $('.js-items').masonry({
        itemSelector: '.js-item'
      });
      $msnry.masonry('layout');
    }
  });

  // box-remember styling wrapper (part of the b9lab documentation update)
  $(".js-box-remember").wrap("<div class='bg-gray-100 flex my-12 shadow-lg'></div>");
  $(".js-box-remember").before("<div class='bg-primary-base py-12 flex flex-shrink-0 w-32 items-center justify-center'><img src='/img/box-remember.svg' width='64')'></div>");

  function mobileMenu(w) {
    if (w < 1199) {
      $('.js-header .js-nav, .js-header .js-btns').appendTo('.js-mobile-nav-inner');
    } else {
      $('.js-mobile-nav .js-nav, .js-mobile-nav .js-btns').insertBefore('.js-mobile-nav-trigger');
      $('.js-has-submenu').on('mouseover', function (event) {
        event.preventDefault();
        $(this).find('.js-submenu').removeClass('invisible opacity-0 pointer-events-none');
      });
      $('.js-has-submenu').on('mouseleave', function (event) {
        event.preventDefault();
        $(this).find('.js-submenu').addClass('invisible opacity-0 pointer-events-none');
      });
    }
  }2

  function mobileFooterMenu(w) {
    if (w < 768) {
      $('.js-footer .js-collapse').attr('aria-expanded', 'false').addClass('js-collapsed');
      $('.js-footer .js-collapse').addClass('hidden collapsed');
      $('.js-footer .js-collapse-trigger').addClass('collapsed');
    } else { $('.js-footer .js-collapse').attr('aria-expanded', 'true').removeClass('js-collapsed');
      $('.js-footer .js-collapse').removeClass('hidden collapsed');
    }
  }

  $('.js-mobile-nav-trigger').on('click', function(event) {
    event.preventDefault();
    $('.js-mobile-nav').removeClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').removeClass('invisible opacity-0 pointer-events-none');
  });

  $('.js-backdrop, .js-mobile-nav-trigger-close').on('click', function (event) {
    event.preventDefault();

    $('.js-mobile-nav').addClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').addClass('invisible opacity-0 pointer-events-none');
    $('.js-sidebar-inner').addClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
  });

  $('.js-community-nav-trigger-close, .js-backdrop-community-nav, .js-community-nav-trigger').on('click', function (event) {
    event.preventDefault();
    $('.js-community-nav').toggleClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop-community-nav').toggleClass('invisible opacity-0 pointer-events-none scale-95');
  });

  try {
    highlight();
  } catch (err) {
    setTimeout(function() {
      highlight();
    }, 2500);
  }

  function highlight() {
    $('.js-editor-content pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  if ($('.recently-updated').length) {

    var html = '';

    if (typeof Cookies.get('recently-updated') !== 'undefined') {
      $('.recently-updated').append(Cookies.get('recently-updated'));
    } else {
      fetch('https://api.github.com/users/status-im/repos?sort=updated&per_page=3')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: '
              + response.status);
              return;
            }

            response.json().then(function(data) {

              data.forEach(function(element) {
                html += '<li><a href="' + element.html_url + '">' + element.full_name + '</a></li>';
              });

              Cookies.set('recently-updated', html, { expires: 1 });
              $('.recently-updated').append(html);

            });

          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }

  }

  if ($('#advocacy-programs').length) {
    function retrieveAdvocacyPrograms() {
      $.ajax({
        type: 'get',
        url: 'https://statusphere.status.im/api/v1/boards/public/?is_featured=true&org=375',
        success: function(response) {
          $.each(response, function(index, program) {
            var description = program.description.substr(0, 200) + '...';
            $('#advocacy-programs').prepend('<div class="inner"> \
                <a href="https://statusphere.status.im/b/'+ program.uuid+'/view" class="card-inner"> \
                  '+program.title+'\
                </a> \
                <p class="details">'+description+'</p> \
              </div>');
          });
        }
      });
    }

    retrieveAdvocacyPrograms();

  }

  $('.js-sidebar').stick_in_parent({
    offset_top: 30
  });

  if ($('input[name="userSearch"]').length) {
    window.addEventListener('click', function(e) {
      if (document.getElementById('search-form').contains(e.target)) {
        $('#search-form').removeClass('inactive');
      } else {
        $('#search-form').addClass('inactive');
      }
    });
    $('input[name="userSearch"]').on('keyup', function() {
      var val = $(this).val();
      $('#search-results').empty();
      $.ajax({
        url: 'https://search.status.im/status.im/_search?size=10&_source=title,url&&q=' + val
      })
        .done(function(results) {
          $.each(results.hits.hits, function(index, value) {
            $('<a class="border-t border-gray-100 py-4 text-gray-900 block first:border-t-0 hover:text-primary-base" href="' + value._source.url + '">' + value._source.title + '</a>').appendTo('#search-results');
          });
        });
    });
  }

  $('.js-scrollto').on('click', function(event) {
    event.preventDefault();
    var id = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(id).offset().top
    }, 300);
  });

  if ($('.js-announcement').length) {
    var ghostContentKey = '10e7f8c1f793d2945ea1177076';
    $.ajax({
      url: 'https://our.status.im/ghost/api/v2/content/posts/?key='+ ghostContentKey +'&limit=1&fields=title,url'
    })
    .done(function(results) {
      $('.js-announcement b').text(results.posts[0].title);
      $('.js-announcement').attr('href', results.posts[0].url).removeClass('inactive');
    })
    .fail(function() {
      $.ajax({
        url: 'https://our.status.im/ghost/api/v0.1/posts/?include=tags&formats=plaintext&client_id=ghost-frontend&client_secret=2b055fcd57ba&limit=1'
      })
      .done(function(results) {
        $('.js-announcement b').text(results.posts[0].title);
        $('.js-announcement').attr('href', 'https://our.status.im' + results.posts[0].url).removeClass('inactive');
      });
    })
  }

  $('.js-sidebar-mobile-trigger').on('click', function(event) {
    event.preventDefault();
    $('.js-sidebar-inner').removeClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').removeClass('invisible opacity-0 pointer-events-none');
  });

  $('.js-mobile-sidebar-trigger-close').on('click', function (event) {
    event.preventDefault();
    $('.js-sidebar-inner').addClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').addClass('invisible opacity-0 pointer-events-none');
  });

  if ($('.js-quick-nav').length) {
    var quickNavOffset = $('.js-quick-nav').offset().top;
    $(window).on('resize', function () {
      quickNavOffset = $('.js-quick-nav').offset().top;
    });
    $(window).on('scroll', function () {
      var y = $(window).scrollTop();
      if (y > quickNavOffset) {
        $('.js-quick-nav, .js-quick-nav-sub').addClass('fixed');
        $('.js-quick-nav, .js-quick-nav-sub').removeClass('absolute');
      } else {
        $('.js-quick-nav, .js-quick-nav-sub').removeClass('fixed');
        $('.js-quick-nav, .js-quick-nav-sub').addClass('absolute');
      }
    });
    $('.js-quick-nav-sub ul li a').on('click', function(event) {
      event.preventDefault();
      var id = $(this).attr('href');
      $('html, body').animate({
        scrollTop: $(id).offset().top - 100
      }, 300);
    });
  }

  if ($('.open-issues').length) {

    var htmlReact = '';

    if (typeof Cookies.get('open-issues-react') !== 'undefined') {
      $('.open-issues-react').append(localStorage.getItem('open-issues-react'));
    } else {
      fetch('https://api.github.com/repos/status-im/status-react/issues?sort=created&per_page=30')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }

            response.json().then(function(data) {

              var i = 0;

              data.forEach(function(element) {
                if (typeof element.pull_request === 'undefined') {
                  if(i < 4){
                    var current= new Date();
                    var labelsHtml = '<div class="tags">';
                    var labels = element.labels;
                    labels.forEach(function(label){
                      labelsHtml += '<div class="tag">'+ label.name +'</div>'
                    });
                    labelsHtml += '</div>';
                    htmlReact += '<li> \
                        <div class="number">#'+ element.number +'</div> \
                        <div class="details"> \
                          <b><a href="'+ element.html_url +'" target="_blank">' + element.title + '</a></b> \
                            '+ labelsHtml +' \
                          <div class="opened"> \
                            Opened: <time>'+ timeDifference(current, new Date(element.created_at)) +'</time> \
                          </div> \
                          <div class="activity"> \
                            Last activity: <time>'+ timeDifference(current, new Date(element.updated_at)) +'</time> \
                          </div> \
                        </div> \
                      </li>';
                    i++;
                  }
                }
              });

              localStorage.removeItem('open-issues-react');
              localStorage.setItem('open-issues-react', htmlReact);
              Cookies.set('open-issues-react', true, { expires: 1 });
              $('.open-issues-react').append(htmlReact);

            });

          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }

    var htmlGo = '';

    if (typeof Cookies.get('open-issues-go') !== 'undefined') {
      $('.open-issues-go').append(localStorage.getItem('open-issues-go'));
    } else {
      fetch('https://api.github.com/repos/status-im/status-go/issues?sort=created&per_page=30')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: '
                + response.status);
              return;
            }

            response.json().then(function(data) {

              var i = 0;

              data.forEach(function(element) {
                if (typeof element.pull_request === 'undefined') {
                  if(i < 4){
                    var current= new Date();
                    var labelsHtml = '<div class="tags">';
                    var labels = element.labels;
                    labels.forEach(function(label){
                      labelsHtml += '<div class="tag">'+ label.name +'</div>'
                    });
                    labelsHtml += '</div>';
                    htmlGo += '<li> \
                        <div class="number">#'+ element.number +'</div> \
                        <div class="details"> \
                          <b><a href="'+ element.html_url +'" target="_blank">' + element.title + '</a></b> \
                            '+ labelsHtml +' \
                          <div class="opened"> \
                            Opened: <time>'+ timeDifference(current, new Date(element.created_at)) +'</time> \
                          </div> \
                          <div class="activity"> \
                            Last activity: <time>'+ timeDifference(current, new Date(element.updated_at)) +'</time> \
                          </div> \
                        </div> \
                      </li>';
                    i++;
                  }
                }
              });

              localStorage.removeItem('open-issues-go');
              localStorage.setItem('open-issues-go', htmlGo);
              Cookies.set('open-issues-go', true, { expires: 1 });
              $('.open-issues-go').append(htmlGo);

            });

          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }

  }

  $(window).scroll(function() {
    const sticky = {
      position: 'sticky',
      width: '100%',
      top: '0',
      background: '#FFFFFF',
      boxShadow: '0px 3px 40px rgba(0, 0, 0, 0.04)',
    }

    const relative = {
      position: '',
      width: '%',
      top: '',
      background: '',
      boxShadow: '',
    }

    const header = $('#header');
    let scroll = $(window).scrollTop();
  
    if (scroll) header.css(sticky);
    else header.css(relative);
  });

  // Partner campaign landing page start
  if (document.title === 'Status - Partner Campaign Template' || document.title === 'Status - criptomaniacos') {

    let width =  w;

    const statusLogoMobile = {
      "position": "absolute",
      "left": "50%",
      "transform": "translate(-50%)"
    }

    const statusLogoDesktop = {
      "position": "",
      "left": "",
      "transform": ""
    }

    const partnerHeroDesktop = {
      "width": "65%",
      "padding-left": "45px",
      "padding-bottom": "50px",
      "height": ""
    }

    const partnerHeroMobile = {
      "height": "400px",
      "width": "",
      "padding-left": "",
      "padding-bottom": ""
    }

    const partnerPhone = {
      "margin": "100px auto 0 auto",
      "height": "400px"
    }

    const partnerPhoneMobile = {
      "margin-top": "30px",
      "width": "300px",
      "height": "350px"
    }

    $('footer').css("display", "none");
    $('.splide__arrow').css("display", "none");
    $('.splide__pagination').css("bottom", "-3rem");
    $('.splide__pagination__page.is-active').css("background", "#ccc");
    $('.partner-phone img').css(partnerPhone);
    $('.partner-phone-mobile img').css(partnerPhoneMobile);

    if (w < 768) {
      $('.logo img').css(statusLogoMobile);
      $('header').css("margin-top", "5px");
      $('.partner-hero-image img').css(partnerHeroMobile);
      $('.image-slider').show();
      $('.desktop-tiles').hide();
      $('.partner-cta-mobile').show();
      $('.desktop-features').hide();
    } else {
      $('.logo img').css(statusLogoDesktop);
      $('.partner-hero-image img').css(partnerHeroDesktop);
      $('.image-slider').hide();
      $('.desktop-tiles').show();
      $('.partner-cta-mobile').hide();
      $('.desktop-features').show();
    }

    window.addEventListener("resize", function(event) {
      width = document.body.clientWidth;
      if (width < 768) {
        $('.logo img').css(statusLogoMobile);
        $('.partner-hero-image img').css(partnerHeroMobile);
        $('header').css("margin-top", "5px");
        $('.image-slider').show();
        $('.desktop-tiles').hide();
        $('.partner-cta-mobile').show();
        $('.desktop-features').hide();
      } else {
        $('.logo img').css(statusLogoDesktop);
        $('.partner-hero-image img').css(partnerHeroDesktop);
        $('.image-slider').hide();
        $('.desktop-tiles').show();
        $('.partner-cta-mobile').hide();
        $('.desktop-features').show();
      }
    })
  }
  // Partner campaign landing page end

  if($('.js-right-sub-navigation').length){
    $('.js-editor-content h1, .js-editor-content h2, .js-editor-content h3').each(function (index, element) {
      var id = $(this).attr('id');
      var title = $(this).text();
      if (title === 'Open Positions') {
        $('.js-right-sub-navigation').css("display", "none");
        return false;
      }
      $('.js-right-sub-navigation ul').append('<li class="mt-8 hover:text-primary-base transition-all duration-200 linear text-lg li-'+ $(this)[0].nodeName.toLowerCase() +'"><a href="#'+ id +'" class="text-gray-500 antialiased">' + title + '</a></li>');
    });
    $('.js-right-sub-navigation').stick_in_parent({
      offset_top: 30
    });
    $('.js-right-sub-navigation a').on('click', function() {
      var id = $(this).attr('href');
      $('html, body').animate({
        scrollTop: $(id).offset().top - 50
      }, 500);
      return false;
    });
  }

  // Animate Keycard Intro Elements
  ScrollReveal().reveal('.keycard-animate-1', {
    opacity: 1,
    duration: 0,
    viewFactor: 0.5,
    afterReveal: function(){

      // Animate Card
      anime({
        targets: '.keycard-animate-1 .card',
        scale: [0.7, 1],
        rotateX: [-10, 0],
        rotateY: [10, 0],
        rotateZ: [15, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });

      // Animate Phone
      anime({
        targets: '.keycard-animate-1 .phone',
        scale: [0.95, 1],
        translateX: [-30, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });

      // Animate Circles
      anime({
        targets: '.keycard-animate-1 .circles',
        scale: [0.9, 1],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });
    }
  });

  // Animate Keycard Cards
  ScrollReveal().reveal('.keycard-animate-2', {
    opacity: 1,
    duration: 0,
    viewFactor: 0.5,
    afterReveal: function(){

      // Animate Black Card
      anime({
        targets: '.keycard-animate-2 .front-1',
        translateX: [-50, 0],
        scale: [0.7, 1],
        rotateX: [-10, 0],
        rotateY: [0, 0],
        rotateZ: [-10, 0],
        duration: 750,
        easing: 'easeInOutQuad',
      });

      // Animate White Card
      anime({
        targets: '.keycard-animate-2 .front-2',
        scale: [0.7, 1],
        rotateX: [-10, 0],
        rotateY: [0, 0],
        rotateZ: [-10, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });

      // Animate Cyan Card
      anime({
        targets: '.keycard-animate-2 .front-3',
        translateX: [50, 0],
        scale: [0.7, 1],
        rotateX: [0, 0],
        rotateY: [0, 0],
        rotateZ: [-10, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 200
      });
    }
  });


  // Animate Keycard Transaction

  var keycardAnimate3Viewfactor = 1;

  if(w < 1200){
    keycardAnimate3Viewfactor = 0.8;
  }

  ScrollReveal().reveal('.keycard-animate-3', {
    opacity: 1,
    duration: 0,
    viewFactor: keycardAnimate3Viewfactor,
    afterReveal: function(){

      // Animate Morph Element
      anime({
        targets: '.keycard-animate-3 .morph',
        opacity: [0, 1],
        translateY: [20,0],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: function(anim) {

          // Delete amount
          setTimeout(function() {
            typeWriterDelete($('.keycard-animate-3 .amount span'), typeWriter);
          }, 300);

        }
      });
    }
  });

  function typeWriterDelete(e, f) {
    var t = e.text();
    if (t.length > 0) {
      e.text(t.substring(0, t.length - 1));
      setTimeout(function() {
        typeWriterDelete(e, f)
      }, 200);
    }else{

      // Write amount
      $('.keycard-animate-3 .amount span').addClass('active');
      typeWriter($('.keycard-animate-3 .amount span'), '15', 0);
    }
  }

  function typeWriter(e, txt, i) {
    var t = e.text();
    if (t.length < txt.length) {
      e.text(e.text() + txt.charAt(i));
      i++;
      setTimeout(function() {
        typeWriter($('.keycard-animate-3 .amount span'), '15', i);
      }, 200);
    }else{

      // Animate Morph Element
      anime({
        targets: '.keycard-animate-3 .morph',
        left: 0,
        width: '100%',
        bottom: 0,
        duration: 500,
        delay: 300,
        height: '160px',
        zIndex: '4',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: '22px',
        borderBottomLeftRadius: '22px',
        easing: 'easeInOutQuad',
        changeBegin: function(anim) {
          $('.keycard-animate-3').attr('data-step', 2);
        },
        complete: function(anim) {

          // Animate Circles
          anime({
            targets: '.keycard-animate-3 .morph .step-2 .circles',
            duration: 3000,
            keyframes: [
              {
                opacity: 0.6,
                scale: 0.6
              },
              {
                opacity: 0.3,
                scale: 1
              },
              {
                opacity: 0.6,
                scale: 0.6
              },
              {
                opacity: 0.3,
                scale: 1
              },
              {
                opacity: 0.6,
                scale: 0.6
              },
              {
                opacity: 0.3,
                scale: 1
              },
            ],
            easing: 'easeInOutQuad'
          });

          // Animate Keycard behind phone

          var translateXFront4 = 70;

          anime({
            targets: '.keycard-animate-3 .front-4',
            duration: 2000,
            keyframes: [
              {
                translateX: 0,
                opacity: 1
              },
              {
                translateX: translateXFront4,
                delay: 1200
              },
            ],
            easing: 'easeInOutQuad',
            complete: function(anim) {

              var keycardAnimate3MorphWidth = 'calc(100% + 140px)',
                keycardAnimate3MorphLeft = '-70px',
                keycardAnimate3MorphHeight = '102px';

                if(w < 1200){
                  keycardAnimate3MorphWidth = 'calc(100% + 100px)',
                  keycardAnimate3MorphLeft = '-50px',
                  keycardAnimate3MorphHeight = '82px';
                }

              // Animate transaction complete
              anime({
                targets: '.keycard-animate-3 .morph',
                left: keycardAnimate3MorphLeft,
                width: keycardAnimate3MorphWidth,
                bottom: '20px',
                duration: 500,
                height: keycardAnimate3MorphHeight,
                backgroundColor: '#4EBC60',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px',
                borderBottomLeftRadius: '12px',
                easing: 'easeInOutQuad',
                begin: function(anim) {
                  $('.keycard-animate-3').attr('data-step', 3);
                },
              })

              anime({
                targets: '.keycard-animate-3 .front-4',
                opacity: 0,
                delay: 1000,
                duration: 500,
                easing: 'linear',
              })

            }
          });

        }
      });
    }
  }

  // Animate Keycard Lock

  var keycardAnimate4Viewfactor = 1;

  if(w < 1200){
    keycardAnimate4Viewfactor = 0.8;
  }

  ScrollReveal().reveal('.keycard-animate-4', {
    opacity: 1,
    duration: 0,
    viewFactor: keycardAnimate4Viewfactor,
    afterReveal: function(){

      var phoneNumbersToAnimate = [2,7,6,0,1,5];
      for (var i = 0; i < phoneNumbersToAnimate.length; i++) {
        anime({
          targets: '.keycard-animate-4 .numbers .nr-' + phoneNumbersToAnimate[i],
          delay: i*500,
          backgroundColor: '#536DE1',
          color: '#fff',
          duration: 200,
          easing: 'easeInOutQuad',
          direction: 'alternate'
        });
        anime({
          targets: '.keycard-animate-4 .dots .dot-' + i,
          delay: i*500,
          backgroundColor: '#536DE1',
          duration: 200,
          easing: 'easeInOutQuad',
        });
      };

      setTimeout(function() {

        // Animate Morph Element
        anime({
          targets: '.keycard-animate-4 .morph',
          duration: 500,
          delay: 300,
          translateY: ['100%', 0],
          easing: 'easeInOutQuad',
          changeBegin: function(anim) {
            $('.keycard-animate-4').attr('data-step', 2);
          },
          complete: function(anim) {
            // Animate Circles
            anime({
              targets: '.keycard-animate-4 .morph .step-2 .circles',
              duration: 3000,
              keyframes: [
                {
                  opacity: 0.6,
                  scale: 0.6
                },
                {
                  opacity: 0.3,
                  scale: 1
                },
                {
                  opacity: 0.6,
                  scale: 0.6
                },
                {
                  opacity: 0.3,
                  scale: 1
                },
                {
                  opacity: 0.6,
                  scale: 0.6
                },
                {
                  opacity: 0.3,
                  scale: 1
                },
              ],
              easing: 'easeInOutQuad'
            });

            // Animate Keycard behind phone

            var translateXFront4 = 70;

            anime({
              targets: '.keycard-animate-4 .front-4',
              duration: 2000,
              keyframes: [
                {
                  translateX: 0,
                  opacity: 1
                },
                {
                  translateX: translateXFront4,
                  delay: 1200
                },
              ],
              easing: 'easeInOutQuad',
              complete: function(anim) {

                // Animate transaction complete

                var keycardAnimate3MorphWidth = '360px',
                  keycardAnimate3MorphLeft = '-70px',
                  keycardAnimate3MorphHeight = '102px';

                  if(w < 1200){
                    keycardAnimate3MorphWidth = '281px',
                    keycardAnimate3MorphLeft = '-50px',
                    keycardAnimate3MorphHeight = '82px';
                  }

                anime({
                  targets: '.keycard-animate-4 .morph',
                  left: keycardAnimate3MorphLeft,
                  width: keycardAnimate3MorphWidth,
                  bottom: '20px',
                  duration: 500,
                  height: keycardAnimate3MorphHeight,
                  backgroundColor: '#4EBC60',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  borderBottomRightRadius: '12px',
                  borderBottomLeftRadius: '12px',
                  easing: 'easeInOutQuad',
                  begin: function(anim) {
                    $('.keycard-animate-4').attr('data-step', 3);
                  },
                })

                anime({
                  targets: '.keycard-animate-4 .front-4',
                  opacity: 0,
                  delay: 1000,
                  duration: 500,
                  easing: 'linear',
                })

              }
            });
          }
        });

      }, 3000);

    }
  });

  ScrollReveal().reveal('.private-and-secure', {
    opacity: 1,
    duration: 0,
    viewFactor: 1,
    afterReveal: function(){

      privateAndSecureAnimation();

    }
  });

  function privateAndSecureAnimation(){

    anime({
      targets: '.private-and-secure .avatar',
      keyframes: [
        {scale: 1},
        {scale: 0.7},
        {scale: 1},
      ],
      duration: 1000,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: '.private-and-secure .key',
      opacity: 1,
      duration: 300,
      translateX: 72,
      translateY: -100,
      scale: [0, 1],
      delay: 800,
      easing: 'linear',
      complete: function(anim) {
        anime({
          targets: '.private-and-secure .key',
          rotate: 90,
          duration: 400,
          easing: 'linear',
          delay: 300,
          complete: function(anim) {
            anime({
              targets: '.private-and-secure .lock .absolute',
              translateY: -3,
              easing: 'linear',
              duration: 300,
              delay: 200,
              complete: function(anim) {
                anime({
                  targets: '.private-and-secure .overlay',
                  opacity: [1, 0],
                  duration: 300,
                  easing: 'linear',
                  delay: 200,
                  complete: function(anim) {
                    anime({
                      targets: '.private-and-secure .lock .absolute',
                      translateY: 0,
                      duration: 300,
                      easing: 'linear',
                      delay: 1000,
                    });
                    anime({
                      targets: '.private-and-secure .overlay',
                      opacity: [0, 1],
                      duration: 300,
                      easing: 'linear',
                      delay: 1000,
                    });
                    anime({
                      targets: '.private-and-secure .key',
                      rotate: 0,
                      translateX: 0,
                      translateY: 0,
                      scale: [1, 0],
                      duration: 300,
                      easing: 'linear',
                      delay: 1000,
                      complete: function(anim) {
                        setTimeout(function() {
                          privateAndSecureAnimation();
                        }, 500);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

  }

  ScrollReveal().reveal('.home-all', {
    opacity: 1,
    delay: 500,
    duration: 0,
    viewFactor: .5,
    afterReveal: function(){

      homeAllAnimation();

    }
  });

  function homeAllAnimation(){
    anime({
      targets: '.home-all .img-1',
      translateX: [-160, 0],
      duration: 1000,
      easing: 'linear',
    });
    anime({
      targets: '.home-all .img-3',
      translateX: [160, 0],
      duration: 1000,
      easing: 'linear',
      complete: function(anim) {
        anime({
          targets: '.home-all .overlay',
          opacity: [0, 1],
          duration: 500,
          easing: 'linear',
          complete: function(anim) {
            anime({
              targets: '.home-all .circles-container',
              scale: [0, 1],
              opacity: [0, 1],
              duration: 1500,
              easing: 'linear',
              complete: function(anim) {
                anime({
                  targets: '.home-all .circles-container',
                  scale: [1, 0],
                  opacity: [1, 0],
                  duration: 1500,
                  delay: 500,
                  easing: 'linear',
                  complete: function(anim) {
                    anime({
                      targets: '.home-all .overlay',
                      opacity: [1, 0],
                      duration: 500,
                      easing: 'linear',
                      complete: function(anim) {
                        anime({
                          targets: '.home-all .img-1',
                          translateX: [0, -160],
                          duration: 1000,
                          easing: 'linear',
                        });
                        anime({
                          targets: '.home-all .img-3',
                          translateX: [0, 160],
                          duration: 1000,
                          easing: 'linear',
                          complete: function(anim) {
                            setTimeout(function() {
                              homeAllAnimation();
                            }, 1500);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  function messengerIntroAnimation(){
    anime({
      targets: '.privacy-first-step-1 .lock .absolute',
      translateY: -3,
      easing: 'linear',
      duration: 300,
      delay: 500,
      complete: function(anim) {
        anime({
          targets: '.privacy-first-step-1',
          opacity: [1,0],
          easing: 'linear',
          duration: 300,
          delay: 300,
        })
        anime({
          targets: '.privacy-first-step-2',
          opacity: [0,1],
          easing: 'linear',
          duration: 300,
          delay: 500,
          complete: function(anim) {
            anime({
              targets: '.privacy-first-step-1',
              opacity: [0,1],
              easing: 'linear',
              duration: 300,
              delay: 2000,
            })
            anime({
              targets: '.privacy-first-step-2',
              opacity: [1,0],
              easing: 'linear',
              duration: 300,
              delay: 2000,
              complete: function(anim) {
                anime({
                  targets: '.privacy-first-step-1 .lock .absolute',
                  translateY: 0,
                  easing: 'linear',
                  duration: 300,
                  delay: 500,
                  complete: function(anim) {
                    setTimeout(function() {
                      messengerIntroAnimation();
                    }, 1500);
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  messengerIntroAnimation();

  function timeDifference(current, previous) {
    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    
    if (elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + ' seconds ago';   
    }
    
    else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
    
    else if (elapsed < msPerDay ) {
      return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
    }
    
    else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
    }
    
    else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}


});
