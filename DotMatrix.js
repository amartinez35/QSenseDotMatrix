function matriceGen(l, c, ray, o) {
  var id = 1,
	  m = new Array();
	for (var i = 0; i < l; i++) {
	  for (var j = 0; j < c; j++) {
		  m.push([(i * 2 + o) * ray, (j * 2 + o) * ray, id]);
			id++;
		}
	}
	return m;
}

function dotMatrix(parent, data, colors, width, height, col, lig) {
  var _Width = width,
	  _Height = height,
		nbLignes = lig,
	  nbColonnes = col,
	  nbObjets = nbColonnes * nbLignes,
	  rayon = Math.min(_Width, _Height) / (Math.max(nbColonnes, nbLignes) * 2),
	  matrixAuto,
	  _Data = data;
	
	matrixAuto = matriceGen(nbLignes, nbColonnes, rayon, 1);
	
	var svg = d3.select(parent)
    .append("svg")
    .attr("width", _Width)
    .attr("height", _Height);
	
	svg.selectAll("circle")
    .data(matrixAuto)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return d[1];
    })
    .attr("cy", function(d) {
      return d[0];
    })
    .attr("r", rayon*0.9)
    .attr("fill", function(d){
      var tmp = 0;
      for(var i = 0; i < _Data.length; i++){
        if(d[2] >= (tmp * nbObjets / 100) && d[2] <= ((tmp + _Data[i])) * nbObjets / 100){
          return colors[i%colors.length];
        }
        tmp += _Data[i];
	    }
    });
	
  return dotMatrix;
}

function svgMatrix(parent, image, data, colors, width, height, col, lig) {
  var _Width = width,
	  _Height = height,
		nbLignes = lig,
	  nbColonnes = col,
	  nbObjets = nbColonnes * nbLignes,
	  rayon = Math.min(_Width, _Height) / (Math.max(nbColonnes, nbLignes) * 2),
	  matrixAuto,
	  _Data = data;
	
	matrixAuto = matriceGen(nbLignes, nbColonnes, rayon, 0);
	
	var svg = d3.select(parent)
    .append("svg")
    .attr("width", _Width)
    .attr("height", _Height);
	
  d3.xml(image, function(xml) {
 
  var imported_node = document.importNode(xml.documentElement, true);
	var svgWidth = imported_node.width.baseVal.value;
  var svgHeight = imported_node.height.baseVal.value;
  var svgMax = Math.max(svgWidth, svgHeight);
		
  svg.selectAll(".svg_image")
    .data(matrixAuto)
    .enter()
    .append("g")
    .each(function(d,i){
    // Clone and append xml node to each data binded element.
    var imported_svg = this.appendChild(imported_node.cloneNode(true));
    })
    .attr("transform", function(d){
      return "translate(" + d[1]  + "," + d[0] + ") scale("+(rayon*2 / svgMax)+")";
    })
    .select("svg").select("path").attr("style", function(d){

  var tmp = 0;

  for(i= 0; i< data.length; i++){
    if(d[2] >= (tmp * nbObjets / 100) && d[2] <= ((tmp + data[i])) * nbObjets / 100){
      return "fill: "+colors[i%colors.length];
    }
    tmp += data[i];

  }
  });
	});
		
  return svgMatrix;
}