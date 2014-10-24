//application pack "ramda060" for red-eagle
//experiment with the ramda library
(function(exports){
var libs = [
  "//cdnjs.cloudflare.com/ajax/libs/ramda/0.6.0/ramda.min.js"
];
var inject = function(url){
  var script = document.createElement("script");
  script.src=url;
  script.defer=true;
  document.head.appendChild(script);
};
libs.map(inject);
exports.tryme=function(){return R.join("\n",["This is pack ramda060.","Thank you."]);};

}(typeof(exports)==='undefined' ? this.ramda060={} : exports);
