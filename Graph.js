/**
 * @author Érick Luiz Fonseca Lopes 
 * @license MIT 
 * @description Lib para criação de gráfico polar 
 */

let Graph = (function(){

    let _config = {
        layers: 4,
        centerX: 400,
        centerY: 0.8125 * 400,
        sizeControl: (0.065 * 800) / (6 / 5),
        fixAngle: -0.5 * Math.PI,
        currentAngle: 0 * Math.PI,
        sliceAngle: (2/4 * Math.PI),
        defaultFillColor: '#FDF200',
        colors: ['#DB3340', '#DB3340', '#FDF200', '#75EB00'],
        cx: null,
        slices: 2,
        defaultColor: '#fff',
        canvas: null
    }

    let _draw = (canvas) => {
        let { cx } = _config;
        _config.canvas = canvas;
        cx.fillStyle = "white";
		cx.fillRect(0,0,canvas.width,canvas.height);
		cx.rect(0,0,canvas.width,canvas.height);
        cx.stroke();
    }

    let _fixData = (data) => {
        console.log(data.length, _config.slices);
        if(data.length < _config.slices) {
            let newData = new Array(_config.slices).fill(0);
            data.forEach((item, idx) => {
                newData[idx] = item;
            });
            return newData;
        }
        return data;
    }

    let _drawSlice = (slice, levelToDraw) => {

        const ray = _config.sizeControl;
        const {cx, defaultColor} = _config;
        const sX = _config.centerX;
        const sY = _config.centerY;
        const colors = _config.colors;

        // Start and EndAngle 
        const sAngle = _config.fixAngle + _config.currentAngle + (slice - 1) * _config.sliceAngle;
        const eAngle = _config.fixAngle + slice * _config.sliceAngle;

        for(i = _config.layers + 1; i > 0; i--) {

            _config.cx.beginPath();
            cx.arc(sX, sY, ray * i, sAngle, eAngle);
            cx.lineTo(sX, sY);
            if(levelToDraw >= i) {
                cx.fillStyle = colors[i-1] || _config.defaultFillColor;
            } else {
                cx.fillStyle = defaultColor;
            }
            cx.fill();
            cx.stroke();
        }

        _drawLine(eAngle, sAngle);
    }

    let _drawLine = (sAngle, eAngle) => {
        const ray = _config.sizeControl * (_config.layers + 1);
        const sX = _config.centerX;
        const sY = _config.centerY;
        const { cx } = _config;

        cx.beginPath();
        cx.arc(sX, sY, ray, sAngle, eAngle);
        cx.lineTo(sX, sY);
        cx.stroke();    
    }
    
    let _hiddenLastLine = () => {

        const ray = _config.sizeControl * (_config.layers + 1);
        const {cx} = _config;
        let clr = _config.cx.strokeStyle;


        cx.beginPath();
        cx.arc(_config.centerX, _config.centerY, ray, 0, 2 * Math.PI);
        cx.lineWidth=3;
        cx.strokeStyle = _config.defaultColor;
        cx.stroke();

        // Reset 
        cx.strokeStyle = clr;
        cx.lineWidth = 1;
    }

    let initConfig = function(canvas, slices, layers){
        
        _config.slices = slices > 2? slices: 2;
        _config.cx = canvas.getContext("2d");
        _config.centerX = canvas.width/2;
        canvas.height = 0.8125 * canvas.width;
        _config.centerY = canvas.height/2;
        _config.sizeControl = (0.065 * canvas.width) / (layers / 5);
        _config.sliceAngle = 1/slices * 2 * Math.PI;
        _config.layers = layers;

        _config.cx.save();
        _draw(canvas);
    }

    let fillGraphData = (data = []) => {
        _fixData(data).forEach((slice, idx) => {
            _drawSlice((idx+1),slice);
        });
        _hiddenLastLine();
    }

    let drawSlice = (slice, levelToDraw) => {
        levelToDraw = levelToDraw > _config.layers? _config.layers: levelToDraw < 0? 0: levelToDraw;
        _drawSlice(slice, levelToDraw);
        _hiddenLastLine();
    }
        
    return { fillGraphData , initConfig , drawSlice}  
})();