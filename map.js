// Enable the visual refresh
google.maps.visualRefresh = true;

stOptions = {gridSize: 40, maxZoom: 14, styles: [{
height: 53,
url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
width: 53
},
{
height: 56,
url: "st2.png",
width: 56
},
{
height: 66,
url: "st3.png",
width: 66
},
{
height: 78,
url: "st4.png",
width: 78
},
{
height: 90,
url: "st5.png",
width: 90
}]}


var image = new google.maps.MarkerImage("http://i.imgur.com/m4jfpUA.png",
    new google.maps.Size(60, 60),
    new google.maps.Point(0,0),
    new google.maps.Point(30, 30)
);


var map;  
var markers = [];
var infowindow = new google.maps.InfoWindow();

function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(33.749, -84.389),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl:false,
    mapTypeControl:false
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  var opt = { minZoom: 3, maxZoom: 15 };
  map.setOptions(opt);


   $.ajax({
    url :'https://api.mongolab.com/api/1/databases/map/collections/startup?apiKey=FQ1LcgMgSekjh9HlqEKLIs5Fu6IV4lxH',                          
    type: 'get',                   
    dataType:'json',                   
    success : function(data) {  


        $.each(data, function (index, value) {
          var lat = value.lat;
          var long = value.long;
          var name = value.name;
          var address = value.address;
          var last_round = value.last_round;
          var investors = [value.Investor_1, value.Investor_2, value.Investor_3, value.Investor_4, value.Investor_5,
          value.Investor_6, value.Investor_7, value.Investor_8, value.Investor_9, value.Investor_10, value.Investor_11, value.Investor_12,
          value.Investor_13, value.Investor_14, value.Investor_15, value.Investor_16, value.Investor_17, value.Investor_18, value.Investor_19];
          var investorString ="";
          for (var i = 0; i < investors.length; i++){
              if(investors[i]!=""){
              investorString+=investors[i];
              investorString+=", "
            }
          }
          //form infobox;
          var stuff = '<div id="infoWindow"><h3 align="left">'+name+'</h3>' +
          '<p align="left"><b> Company Address</b>: ' +address+'<br />' +
          '<b> Last Round of Investment</b>: ' +last_round+'<br />'+
          '<b> Current Investors </b> (double click on marker to map them): ' +investorString+'<br /></p></div>' ;
                 
          var marker;
          marker = new google.maps.Marker({
                  position: new google.maps.LatLng(lat, long),
                  map: map,
                  title: name,
                  info: stuff,
                  icon:'http://i.imgur.com/xMJdFAM.png'
          });


          //====store categories and name info as marker properties===
         marker.mycategory = "startups";
          //marker.myname = name;

          marker.desc = stuff;
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.info);
            infowindow.open(map,this);
            //addSubMarker(33.5,-84.1);
          });

          google.maps.event.addListener(marker, 'dblclick', function() {
            eachMarkers(investors);
            map.setZoom(6);
          });

          markers.push(marker);
          marker.setVisible(true);
        });
   	

    }
        
    });


 $.ajax({
    url :'https://api.mongolab.com/api/1/databases/map/collections/investor?apiKey=FQ1LcgMgSekjh9HlqEKLIs5Fu6IV4lxH',                          
    type: 'get',                   
    dataType:'json',                   
    success : function(data) {  


        $.each(data, function (index, value) {
          var lat = value.lat;
          var long = value.long;
          var name = value.name;
          var address = value.address;
          var firm_type = value.firm_type;;
          var deal_size = value.deal_size;
          //var investors = 


          //form infobox;
          var stuff = '<div id="infoWindow"><h3 align="left">'+name+'</h3>' +
          '<p align="left"><b> Company Address</b>: ' +address+'<br />' +
          '<b> Firm Type</b>: ' +firm_type+'<br />' +
          '<b> Number of Startups Invested</b>: ' +deal_size+'<br /></p></div>' ;

          var vmarker;
          vmarker = new google.maps.Marker({
                  position: new google.maps.LatLng(lat, long),
                  map: map,
                  title: name,
                  //animation: google.maps.Animation.DROP,
                  icon:'http://i.imgur.com/rsGR99K.png',
          });

          vmarker.mycategory = "investors";
          
          

          google.maps.event.addListener(vmarker, 'click', function() {
            infowindow.setContent(stuff);
            infowindow.open(map,this);
            //addSubMarker(33.5,-84.1);
          });

          markers.push(vmarker);
          vmarker.setVisible(false);
        });
       // 
    }
        
    });

  
    
   map.setCenter(center);
	var stCluster = new MarkerClusterer(map, markers,stOptions);
     //mapCluster.setIgnoreHidden(true); 

  //startupMarkers();
  //vcMarkers();
  hide('startups');
  hide('investors');


}

function eachMarkers(list){

 /* for (var i = 0; i < eachMarker.length; i++){
    eachMarker[i].setMap(null);
  }
    eachMarker.length=0;*/
    //if(eachMarker.length !=0){
	//var bounds = new google.maps.LatLngBounds();
	//clear();
	
	eachMarker = [];

   for(var i = 0; i< list.length; ++i){
      if(list[i]!=="" && list[i]!="Undisclosed Investor") {
           $.ajax({
                url :'https://api.mongolab.com/api/1/databases/map/collections/investor?q={"name":"'+encodeURIComponent(list[i])+'"}&apiKey=FQ1LcgMgSekjh9HlqEKLIs5Fu6IV4lxH',                          
                type: 'get',                   
                dataType:'json',  
                success : function(data) {           
                $.each(data, function (index, value) {
                  var lat = value.lat;
                  var long = value.long;
                  var name = value.name;
                  var address = value.address;
                  var firm_type = value.firm_type;
                  var deal_size = value.deal_size;


                                              //form infobox;
                  var stuff = '<div id="infoWindow"><h3 align="left">'+name+'</h3>' +
                  '<p align="left"><b> Company Address</b>: ' +address+'<br />' +
                  '<b> Firm Type</b>: ' +firm_type+'<br />' +
                  '<b> Number of Startups Invested</b>: ' +deal_size+'<br /></p></div>' ;

                  var investorMarker;
                  investorMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat+0.01, long+0.01),
                    map: map,
                    title: name,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                   icon:'http://i.imgur.com/m4jfpUA.png'
                    });
                  }); 


                  google.maps.event.addListener(investorMarker, 'dblclick', function() {
            infowindow.setContent(stuff);
            infowindow.open(map,this);
            //addSubMarker(33.5,-84.1);
          });

                  eachMarker.push(investorMarker);
                  eachMarker.splice(0);
                }//success
             }); //ajax end
          
      }
      
   }
                   //deleteOverlays();
                   
                   
}

function addSubMarker(lat,lng){
  var marker;
  marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, long),
          map: map,
          title: name,
          draggable: false,
          animation: google.maps.Animation.DROP,
          icon:'http://i.imgur.com/m4jfpUA.png'
  });
}

// == shows all markers of a particular category, and ensures the checkbox is checked ==
      function show(category) {
        for (var i=0; i<markers.length; i++) {
          if (markers[i].mycategory == category) {
            markers[i].setVisible(true);
          }
          
        }
        

     //mapCluster.setIgnoreHidden(true); 
        //mapcluster.redraw();
        // == check the checkbox ==
        document.getElementById(category+"box").checked = true;
      }

      // == hides all markers of a particular category, and ensures the checkbox is cleared ==
      function hide(category) {
        for (var i=0; i<markers.length; i++) {
          if (markers[i].mycategory == category) {
            markers[i].setVisible(false);
          }
        }
        // == clear the checkbox ==
        document.getElementById(category+"box").checked = false;
        // == close the info window, in case its open on a marker that we just hid
        infowindow.close();
      }

      // == a checkbox has been clicked ==
      function boxclick(box,category) {
        if (box.checked) {
          show(category);
        } else {
          hide(category);
        }

      }

      function myclick(i) {
        google.maps.event.trigger(markers[i],"click");
      }

google.maps.event.addDomListener(window, 'load', initialize);


