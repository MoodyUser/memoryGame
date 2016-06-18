/**
 * Created by yonim on 14/06/16.
 */




$(document).ready(function () {
    let gen_color = ()=> {
        let pattern = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += pattern[parseInt(Math.random() * (16))];
        }
        return color;
    }
    let playerTmplate = (color)=> '<div class="form-group" id="taskTemplate">' +
    '<div class="col-xs-6 col-xs-offset-1">' +
    '<input type="text" class="form-control" name="player[]" placeholder="Name"/>' +
    '</div>' +
    '<div class="col-xs-1" style="width: 65px;">' +
    '<span class="btn btn-default color" style="background-color:' + color + '">C</span>' +
    ' <input type="text" class="form-control hide" name="color[]" value="' + color + '"/>' +
    '</div>' +
    '<div class="col-xs-1">' +
    '<button type="button" class="btn btn-default removeButton">Remove</button>' +
    '</div>' +
    '</div>';

    let currentlyFlipped = [];
    let currentlyplaying = 0;
    const NUMBER_OF_CARDS_IN_GAME = 10;
    let cardsLeft;
    const DIFFICULTY = 4;
    const $GAME_PANEL = $('#gamePanel');
    const $SCORE_PANEL = $('#score');
    let players = [];
    // Initialize the form
    $('#playersForm')
    // Add button click handler
        .on('click', '.addButton', function () {
            $(playerTmplate(gen_color())).insertBefore($('#last'));
        })
        // Remove button click handler
        .on('click', '.removeButton', function () {
            var $row = $(this).closest('.form-group');
            // Remove element containing the fields
            $row.remove();
        })
        .on('click', '.color', function () {
            var $row = $(this);
            let colorStr = gen_color();
            $row.css("background-color", colorStr);
            console.log($row.closest('.form-control'));
            $row.next().val(colorStr);
        })
        .on('click', '.start', function () {
            let data = $('#playersForm').serializeArray();
            data = data.reduce((raw_list, item, k)=> {
                if (k % 2 == 0) {
                    raw = {
                        name: item.value,
                        color: data[k + 1].value,
                        score: 0
                    };

                    raw_list.push(raw)
                }
                return raw_list
            }, []);
            startGame(data)
        });


    $GAME_PANEL.on('click', '.tile', function () {
        let tile = $(this);
        if (canFlip(tile)) {
            tile.addClass("active");
            flipTile(tile)
        }
    });

    class Card {
        constructor(url) {
            //   this.x = 0;
            //   this.y = 0;
            this.url = url;
        }

        match(other) {
            return this.url.contains(other.url)
        }

        getAsHtml() {
            return `<div style="width: 155px;height: 185px; display: inline-block;">
                    <div data-url="${this.url}" class="tile" ></div>
                    </div>`;
        }
    }

    let getImages = (keyword) => {
        return $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                tags: keyword,
                tagmode: "any",
                format: "json"
            }
        ).then(data => {
            return data.items.slice(0, NUMBER_OF_CARDS_IN_GAME)
                .map((v)=> {
                    return v['media']['m']
                });
        });
    };

    function loadImage(url) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                resolve(url)
            };
            img.onerror = function (e) {
                reject(e)
            };
            img.src = url
        });
    }

    function loadImages(images) {
        //promise all creates a diffreaate them?
        return new Promise(function (resolve, reject) {
            Promise.all(images.map(loadImage)).then(images => resolve(images)).catch(err =>reject(err))
        })
    }

    let initGame = urls=> {
        let content = [];
        urls.forEach(url => {
            let temp = new Card(url);
            let temp1 = new Card(url);
            content.push(temp.getAsHtml());
            content.push(temp1.getAsHtml());
        });
        content = _.shuffle(content);
        $("#gamePanel").append(content);
    }

    let startGame = (opponents = players) => {
        let gif = '<video preload="auto"' +
            'style="min-height:432px;width: 600px;;display:block;margin:0 auto;" loop="" muted="" autoplay="autoplay"' +
            'width="600">' +
            '<source src="loading.mp4" type="video/mp4">' +
            'loading...' +
            '</video>';
        $GAME_PANEL.html(gif);
        getImages('cats').then(urls=>loadImages(urls).then(urls => {
            setTimeout(
                ()=> {
                    $GAME_PANEL.html('');
                    players = opponents;
                    players.forEach(item=> {
                        $SCORE_PANEL.append(playerTemplate(item.name, item.color));
                    })
                    cardsLeft = NUMBER_OF_CARDS_IN_GAME;
                    $($("#score p.player")[currentlyplaying]).addClass('playing');
                    initGame(urls);

                }
                , 3000
            )

        }));

    }

    let endGame = () => {
        let restart = $('<button class="btn btn-primary restart" >Restart</button>');
        restart.on('click', ()=> {
            startGame();
            $SCORE_PANEL.css({
                width: "10%",
                position: "fixed"
            });
            $SCORE_PANEL.html('');
            $SCORE_PANEL.removeClass('jumbotron');
        });
        $GAME_PANEL.html('');
        $GAME_PANEL.append(restart);
        $SCORE_PANEL.css({
            width: "90%",
            position: "relative"
        });
        $SCORE_PANEL.addClass('jumbotron');

        $('.playing').removeClass('playing');
        winner = $("#score p.player .score").toArray().reduce((winner, current) => {
            current = $(current);
            if (parseInt(current.html()) > winner.max) {
                winner.max = current;
                winner.player = current.parent();
            }
            return winner;
        }, {max: 0, player: 0});
        winner.player.append("<-- The winner!!");
        winner.player.css("background-color", "blue")

    }

    function flipTile(tile) {
        flipImage(tile);
        currentlyFlipped.push(tile);
        if (currentlyFlipped.length > 1) {
            if (chechWon()) {
                addToPlayer(currentlyplaying);
                currentlyFlipped.forEach(item=> {
                    let shadow = 'inset 10px 10px 20px ' + players[currentlyplaying].color;
                    item.css('box-shadow', shadow);
                    item.css('-moz-box-shadow', shadow);
                    item.css('-webkit-box-shadow', shadow);
                });
                currentlyFlipped = [];
                if (cardsLeft == 0) {
                    endGame()
                }
            } else {
                setTimeout(function () {
                    closeTiles();
                    $($("#score p.player")[currentlyplaying]).removeClass('playing');
                    currentlyplaying = (currentlyplaying < players.length - 1) ? currentlyplaying + 1 : 0;
                    $($("#score p.player")[currentlyplaying]).addClass('playing');
                }, DIFFICULTY * 1000);
            }
        }

    }

    let chechWon = (opponent)=> {
        let won = currentlyFlipped[0].data('url').includes(currentlyFlipped[1].data('url'));
        if (won) {
            cardsLeft--;
        }
        return currentlyFlipped[0].data('url').includes(currentlyFlipped[1].data('url'));
    };

    let closeTiles = ()=> {
        currentlyFlipped.forEach(function (v) {
            v.removeClass('active');
            flipImage(v);
        });
        currentlyFlipped = [];
    };

    let canFlip = (tile)=> {
        if (tile.hasClass("active")) {
            return false;
        }
        return (currentlyFlipped.length < 2) ? true : false;
    }

    let flipImage = function (tile) {
        // let tile = $(this);
        tile.addClass('flip-in');
        tile.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function (e) {
                tile.css('background-image',
                    tile.css('background-image').includes("flipedcard") ? 'url(' + tile.data('url') + ')' : 'url("flipedcard.jpg")'
                );
                tile.removeClass('flip-in');
                tile.addClass('flip-out');
                tile.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                    function (e) {
                        tile.removeClass('flip-out')
                    });
            });
    }

    let playerTemplate = (name, color)=>'<p class="player"><span>' + name + ' : </span >' +
    '<span class="score">0</span>' +
    '</p>';

    let addToPlayer = (nIr) => {
        let $item = $($("#score p.player .score")[nIr]);
        current = parseInt($item.html());
        $item.html(current + 100);
    }

})
;