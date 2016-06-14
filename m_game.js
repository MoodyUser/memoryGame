/**
 * Created by yonim on 14/06/16.
 */
 
class Card {
    constructor(pic_url) {
     //   this.x = 0;
     //   this.y = 0;
        this.pic_url = pic_url;
    }

    getAsHtml() {
    	return `<span class="${this.pic_url}"></span>` ; 
    	
       /* return "<span class=' tile " +
            this.pic_url + "'></span>" */

    }
}




let content1 = [];


let ims = [
	'glyphicon glyphicon-magnet',
	'glyphicon glyphicon-align-center',
	'glyphicon glyphicon-home',
	'glyphicon glyphicon-eur',
	'glyphicon glyphicon-cog' ,	
	'glyphicon glyphicon-picture',
	'glyphicon glyphicon-eye-open',
	'glyphicon glyphicon-hand-up',
	'glyphicon glyphicon-collapse-up',
	'glyphicon glyphicon-knight',
	'glyphicon glyphicon-lamp' ,
	] ;
	
	
	
	
  for (var i = 0; i < ims.length; i++) {
  let temp = new Card(ims[i])  ;
  let temp1 = new Card(ims[i])  ;
  //let ctx = document.getElementById('canvas').getContext('2d');
	$("#can").append("<h1>lalala</h1>");
	//alert($("#can")) ; 
  //temp.getAsHtml()) ; 
  //alert(temp.getAsHtml())
  //content.push(temp1)
  }