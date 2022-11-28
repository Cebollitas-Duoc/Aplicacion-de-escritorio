
    const Datos = document.getElementById("");
    const DatosQ = document.getElementById("");
    
    Chart.register(ChartDataLabels);

    /*------------------------------------------------------ Pruebas ----------------------------------------------------*/
    var controlBar2 = document.getElementById("myBar2Chart");

    var graficoBar2 = new Chart(controlBar2, {
        type: 'bar',
        data: {
            labels: ["Enero", "Febrero", "Marzo", "Abril"],
            datasets: [
                // {
                //     label: 'Linea Flotante',
                //     type: 'line',
                //     data: [5000, 5000, 5000, 5000],
                //     borderColor: 'rgb(75, 192, 192)',
                //     fill: false,
                //     tension: 0.1,
                //     datalabels: {
                //         color: 'black',
                //         backgroundColor: "white",
                //         borderRadius: 10,
                //     }
                // },
                {
                    label: "Cantidad de ventas",
                    backgroundColor: ["#232856","#ffd600","#7095b5","#d6201f","#232856","#ffd600","#7095b5","#d6201f","#232856","#ffd600","#7095b5","#d6201f"],
                    borderColor: "#000000",
                    borderWidth: 1,
                    data: [8346, 1958, 1170, 837],                                
                },
            ],
        },
        options: {
            plugins: {
                datalabels: {
                    backgroundColor: "white",
                    borderRadius: 4,
                    color: 'black',
                    anchor: 'end',
                    align: 'bottom',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    font: {
                        size: 14
                    }
                }
            },
            scales: {
                x: {
                },
                y: {
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        min: 0,
                        max: 30000,
                        maxTicksLimit: 6,
                    }

                }
            },
            legend: {
                display: false
            }
        }

    });