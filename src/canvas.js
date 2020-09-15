
var multiplier = 10

var clear = function clear() {
    
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');

    let small_canvas = document.querySelector('#small-canvas');
    let small_ctx = small_canvas.getContext('2d');

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    small_ctx.fillStyle = "white";
    small_ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.lineWidth = 2;
    ctx.rect(40, 40, 200, 200);
    ctx.stroke();
}

$(window).on("load", () => {

    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');

    canvas.height = 28 * multiplier;
    canvas.width  = 28 * multiplier;

    var small_canvas = document.querySelector('#small-canvas');
    var small_ctx = small_canvas.getContext('2d');

    small_canvas.height = 28;
    small_canvas.width = 28;

    clear();
    drawingInit();
    
    $('#clear').on('click', clear);

    function drawingInit() {
        $('#canvas').on('mousemove', (event) => findXY('move', event));
        $('#canvas').on('mousedown', (event) => findXY('down', event));
        $('#canvas').on('mouseup', (event) => findXY('stop', event));
        $('#canvas').on('mouseout', (event) => findXY('stop', event));
    }
    
    function draw(prevX, prevY, currX, currY) {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2 * multiplier;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();

        small_ctx.beginPath();
        small_ctx.moveTo(prevX / multiplier, prevY / multiplier);
        small_ctx.lineTo(currX / multiplier, currY / multiplier);
        small_ctx.strokeStyle = 'black';
        small_ctx.lineWidth = 2;
        small_ctx.lineCap = 'round';
        small_ctx.stroke();
        small_ctx.closePath();

        predictThis(small_ctx);
    }

    var flag = false;
    var currX = 0;
    var currY = 0;
    var prevX = 0;
    var prevY = 0;
    
    function findXY(res, e) {
        switch (res) {
            case 'down':
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                flag = true;
                break;
            case 'stop':
                flag = false;
                break;
            case 'move':
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - canvas.offsetLeft;
                    currY = e.clientY - canvas.offsetTop;
                    draw(prevX, prevY, currX, currY);
                }
    
        }
    }

})

var setStatus = function(status) {
    var textData = document.querySelector('#status');
    textData.textContent = '✏️ Training: ' + status

    
}

var setPrediction = function(status) {
    var textData = document.querySelector('#prediction');
    textData.textContent = '📝 Prediction: ' + status
}




