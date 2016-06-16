/**
 * Created by yonim on 14/06/16.
 */

class Card {
    constructor(id) {
        //   this.x = 0;
        //   this.y = 0;
        this.id = id;
    }

    getAsHtml() {
        return `<div style="width: 250px;height: 250px; display: inline-block;">
                    <div id="${this.id}" class="tile" ></div>
                    </div>`;

    }
}

let id_to_image = {};
let currentlyFlipped = [];


let populate_cards = (keyword, tile1Id, tile2Id) => {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: keyword,
            tagmode: "any",
            format: "json"
        },
        function (data) {
            let rnd = Math.floor(Math.random() * data.items.length);
            let image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
            id_to_image[tile1Id] = image_src;
            id_to_image[tile2Id] = image_src;
            // $('#' + tile2Id).css('background-image', "url('" + image_src + "')");
            // $('#' + tile1Id).css('background-image', "url('" + image_src + "')");
        }
    )
    ;

};

let content1 = [];


for (let i = 0; i < 12; i++) {
    let temp = new Card('a' + i);
    let temp1 = new Card('b' + i);
    populate_cards('dogs', 'a' + i, 'b' + i);
    content1.push(temp.getAsHtml());
    content1.push(temp1.getAsHtml());
    //  $("#can").append(temp.getAsHtml());
    //$("#can").append(temp1.getAsHtml());
}

let co = _.shuffle(content1);
for (let i = 0; i < content1.length; i++) {
    $("#can").append(co[i]);
}

$('.tile').one('click', function () {
    flip_tile(this)
});

function flip_tile(tile) {
    tile = $(tile);
    flipImage(tile);
    currentlyFlipped.push(tile.attr('id'));
    if (currentlyFlipped.length >= 2) {
        setTimeout(function () {
            currentlyFlipped.forEach(function (v, k) {
                let item = $('#' + v);
                flipImage(item);
                item.one('click', function () {
                    flip_tile(this)
                });
            });
            currentlyFlipped = [];
        }, 3000);

    }
}

let flipImage = function (tile) {
    // let tile = $(this);
    tile.addClass('flip-in');
    tile.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function (e) {
            tile.css('background-image',
                tile.css('background-image').contains("flipedcard") ? 'url(' + id_to_image[tile.attr('id')] + ')' : 'url("flipedcard.jpg")'
            );
            tile.removeClass('flip-in');
            tile.addClass('flip-out');
            tile.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                function (e) {
                    tile.removeClass('flip-out')
                });
        });
}