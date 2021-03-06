var tj = require('togeojson'),
    fs = require('fs'),
    // node doesn't have xml parsing or a dom. use xmldom 
    DOMParser = require('xmldom').DOMParser;
var polyline = require('@mapbox/polyline');

//Change the PATH to your kml Path

const file = '/home/edison/Documentos/Citytaxi_docs/Socobuses/INFORMACION SOCOBUSES/Rutas/626vi_Villapilar_Mateguadua_626vr_Mateguadua_Villapilar.kml' 

toGeoJSON(file).then((geojson)=> {
	convertedWithStyles(geojson).then((converted) => {
		//console.log(converted)
           
         const geo1 = polyline.fromGeoJSON(converted.features[0])
         const geo2 = polyline.fromGeoJSON(converted.features[2])
         console.log("Ida", geo1)
         console.log("regreso", geo2)
        
		//console.log('encoded****************', encoded);

		/*createFile(converted).then((fileCreated) => {
			readFileGeoJSON(fileCreated);
		}).catch((dontCantCreated) => {
			console.error('dontCantCreated', dontCantCreated);
		})*/
	})
})


function toGeoJSON(route) {
	return new Promise((resolve, reject) => {
		const kml = new DOMParser().parseFromString(fs.readFileSync(route, 'utf8'));
		return resolve(kml);
	})
}

function convertedWithStyles(kml) {
	return new Promise((resolve, reject) => {
		const converted =  tj.kml(kml, { styles: true });
		return resolve(converted);
	})
	
}

function createFile(converted) {
	return new Promise((resolve, reject) => {
		const fileToWrite = "/tmp/tests.geojson";
		fs.writeFile(fileToWrite, JSON.stringify(converted) , function(err) {
		    if(err) {
		        return reject(err);
		    }  
		    return resolve(fileToWrite);
		}); 
	})
}

function readFileGeoJSON(filePath) {
	fs.createReadStream('/tmp/tests.geojson')
	  .pipe(encode({precision: 15}))
	  .pipe(process.stdout)
}