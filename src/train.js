var training = false;

var model = tf.sequential();

model.add(tf.layers.dense({ units: 32, inputShape: [784], activation: 'sigmoid' }));     // Hidden layer
model.add(tf.layers.dense({ units: 32, inputShape: [32], activation: 'sigmoid' }));     // Hidden layer
model.add(tf.layers.dense({ units: 10, inputShape: [32], activation: 'sigmoid' }));     // Output layer

const sgdOut = tf.train.sgd(0.5) // Squared gradient decent

model.compile({
    optimizer: sgdOut,
    loss: 'meanSquaredError'
})

$(window).on('load', () => {

    setPrediction(`draw something!`)

    var epoch = 0;
    $('#stop').hide();

    $('#stop').on('click', () => {
        training = false;
        $('#stop').hide();
        $('#train').show();
    })
    
    $('#train').on('click', () => {
        $('#stop').show();
        $('#train').hide();
        setStatus("Starting training...");
        training = true;

        var set = mnist.set(10000, 0)
        var trainingSet = set.training;

        const xs = tf.tensor2d(trainingSet.map(data => data.input))
        const ys = tf.tensor2d(trainingSet.map(data => data.output))

        async function train(xs = tf.tensor2d, ys = tf.tensor2d) {
            while (training) {
                epoch++
                await model.fit(xs, ys, {
                    verbose: false,
                    shuffle: true
                }).then((result) => {
                    let loss = result.history.loss
                    console.log(result)
                    setStatus(`Epoch ${epoch} - Loss ${loss}`)
                });
            }
        }
        
        train(xs, ys).then(() => {
            setStatus(`Training Completed!`)
            training = false;
        })
    })
})



var predictThis = function (ctx) {
    const data = ctx.getImageData(0, 0, canvas.width / multiplier, canvas.height / multiplier).data;

    let out_data = [];
    for (var i = 0; i < data.length; i = i + 4) {
        out_data.push(pixel = data[i] == 255 ? 0 : 1)
    }
    const xs = tf.tensor2d([out_data])
    const out = model.predict(xs)
    let index = out.argMax(1).dataSync()[0];
    setPrediction(`${numbers[index]}`)
    
}

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
