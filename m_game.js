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



for (var i = 0; i < 12; i++) {
    let temp = new Card('a' + i);
    let temp1 = new Card('b' + i);
    populate_cards('dogs', 'a' + i, 'b' + i);
    content1.push(temp.getAsHtml()) ;
    content1.push(temp1.getAsHtml()) ;
  //  $("#can").append(temp.getAsHtml());
    //$("#can").append(temp1.getAsHtml());
}

let co = _.shuffle(content1) ;
for (var i = 0; i < content1.length; i++) {
  $("#can").append(co[i]) ;
}
