/**
 * Created by yonim on 14/06/16.
 */
class Card {
    constructor(pic_url) {
        this.x = 0;
        this.y = 0;
        this.pic_url = pic_url;
    }

    getAsHtml() {
        return "<span class=' tile " +
            this.pic_url + "'></span>"

    }
}




let content =


    $("content").html(


    )
