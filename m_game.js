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
        return `<span id="${this.id}" class="tile" ></span>`;

        /* return "<span class=' tile " +
         this.pic_url + "'></span>" */

    }
}


let populate_cards = (keyword, tile1Id, tile2Id) => {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: keyword,
            tagmode: "any",
            format: "json"
        },
        function (data) {
            var rnd = Math.floor(Math.random() * data.items.length);

            var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");

            $('#' + tile2Id).css('background-image', "url('" + image_src + "')");
            $('#' + tile1Id).css('background-image', "url('" + image_src + "')");

        });

}

let content1 = [];


let ims = [
    'glyphicon glyphicon-magnet',
    'glyphicon glyphicon-align-center',
    'glyphicon glyphicon-home',
    'glyphicon glyphicon-eur',
    'glyphicon glyphicon-cog',
    'glyphicon glyphicon-picture',
    'glyphicon glyphicon-eye-open',
    'glyphicon glyphicon-hand-up',
    'glyphicon glyphicon-collapse-up',
    'glyphicon glyphicon-knight',
    'glyphicon glyphicon-lamp',
];


for (var i = 0; i < 2; i++) {
    let temp = new Card('a' + i);
    let temp1 = new Card('b' + i);
    populate_cards('dogs', 'a' + i, 'b' + i);
    $("#can").append(temp.getAsHtml());
    $("#can").append(temp1.getAsHtml());
}