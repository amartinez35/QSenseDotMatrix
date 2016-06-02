define(["./dotMatrix", "./d3.min", "./rainbowvis", "css!./QSenseDotMatrix.css"],
  function(template) {
    "use strict";
    //palette de couleur par défaut
	  var limiteMax = 100;
    var palette = [
			"#4477aa",
      "#7db8da",
      "#b6d7ea",
      "#46c646",
      "#f93f17",
      "#ffcf02",
      "#276e27",
      "#000000"
    ];
  
	  var colonnes = {
			ref: "nbCol",
			type: "integer",
			label: "Nombre de colonne",
			expression: "always",
			defaultValue: 10,
			max: limiteMax
		};
	  var lignes = {
			ref: "nbLig",
			type: "integer",
			label: "Nombre de ligne",
			expression: "always",
			defaultValue: 10,
			max: limiteMax
		};
	
    var imageMatrix = {
      ref: "svgImage",
			type: "string",
      label: "Défnir une image"
    };

    //définition de l'objet
    return {
      initialProperties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [{
            qWidth: 2,
            qHeight: 50
          }]
        }
      },
      definition: {
        type: "items",
        component: "accordion",
        items: {
          dimensions: {
            uses: "dimensions",
            min: 1,
            max: 1
          },
          measures: {
            uses: "measures",
            min: 1,
            max: 1
          },
          sorting: {
		        uses: "sorting"
          },
          Setting: {
            uses: "settings",
						items: {
						  format:{
							  ref: "format",
								type: "items",
								label: "Format",
								items:{
									colonnes: colonnes,
									lignes: lignes,
									icon: imageMatrix
								}
							}
						}
          }
        }
      },
      snapshot: {
        canTakeSnapshot: true
      },

      //affichage de l'objet
      paint: function ($element, layout) {

        //Taille de l'objet
        var width = $element.width();
        var height = $element.height();

        var id = "container_" + layout.qInfo.qId;

        //construction de la div
        if (document.getElementById(id)) {
          $("#" + id).empty();
        } else {
          $element.append($('<div />').attr("id", id).attr("class", "viz").width(width).height(height));
        }

        //recup des données
        var hc = layout.qHyperCube;
        //recup de la zone d'affichage
        var div = document.getElementById(id);

        //recup de la valeur de la mesure
        var value = hc.qDataPages[0].qMatrix;
				
				var data = new Array();
				var cumul = 0;
				for (var i = 0; i < value.length; i++) {
				  cumul += value[i][1].qNum;
				}
				
				for (var i = 0; i < value.length; i++) {
				  data.push(Math.round(value[i][1].qNum / cumul * 100));
				} 

        var iconMatrix = layout.svgImage;
        //Création de la jauge
				var colonnes = Math.min(limiteMax, layout.nbCol);
				var lignes = Math.min(limiteMax, layout.nbLig);
								
				if(!iconMatrix){
				  var matrix = dotMatrix(div, data, palette, width, height, colonnes, lignes, 'rect');
				}else{
					var machineName = window.location.hostname;
					if(machineName = 'localhost'){
					  machineName += ':4848';
					}
					iconMatrix = 'http://'+machineName+'/content/default/' + iconMatrix;
   			  var matrix = svgMatrix(div, iconMatrix, data, palette, width, height, colonnes, lignes);
				}
    }

  }
});