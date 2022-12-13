
    // const Datos = document.getElementById("datosgrafico");

document.addEventListener('DOMContentLoaded', async () =>{
    var fechasDeCreacion = []
    idPago = new Array(12).fill(0);
    const Datos =  await Graficos.getReserves("Datos");
    Datos.forEach(Dato => {
        // fechasDeCreacion.push(Dato.FECHACREACION)
        index = parseInt(Dato.FECHACREACION.substring(3,5))-1
        idPago[index] += 1
    });
    console.log(idPago.length)
    // const CantidadDias = fechasDeCreacion.length;
    // console.log(CantidadDias)
    // var arr_CantidadDias = CantidadDias.split(',');
    Graficos.crearGraficos()
})


class Graficos {
    static async getReserves(){
        var apidomain = await window.api.apiDomain()
        
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        var r
        await fetch(`${apidomain}/graficos/getdatosgraficos/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
    
    static crearGraficos(){
        Chart.register(ChartDataLabels);

        /*------------------------------------------------------ Pruebas ----------------------------------------------------*/
        var controlBar2 = document.getElementById("myBar2Chart");

        var graficoBar2 = new Chart(controlBar2, {
            type: 'line',
            data: {
                labels: ["Enero", "Febrero", "Marzo", "Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octube","Noviembre","Diciembre"],
                datasets: [
                    {
                        label: "Cantidad de ventas",
                        backgroundColor: ["#232856","#ffd600","#7095b5","#d6201f"],
                        borderColor: "#000000",
                        borderWidth: 1,
                        data: 
                        idPago,
                        // [1, 3, 4, , 1, 6],                                
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        backgroundColor: "white",
                        borderRadius: 4,
                        color: 'black',
                        anchor: 'end',
                        align: 'top',
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
                            max: 30,
                            maxTicksLimit: 6,
                            ticks: 6
                        }

                    }
                },
            }

        });

        

        var controlPie = document.getElementById("myPieChart");
        var graficoPie = new Chart(controlPie, {
            type: 'doughnut',
            data: {
                labels: ["Enero", "Febrero", "Marzo", "Abril"],
                datasets: [{
                    data: [8346, 1958, 1170, 837],
                    backgroundColor: ["#232856","#ffd600","#7095b5","#d6201f"],
                }],
            },
            options: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        footer: (ttItem) => {
                            let sum = 0;
                            let dataArr = ttItem[0].dataset.data;
                            dataArr.map(data => {
                                sum += Number(data);
                            });

                            let percentage = (ttItem[0].parsed * 100 / sum).toFixed(2) + '%';
                            return `Percentage of data: ${percentage}`;
                        }
                    }
                },
                plugins: [ChartDataLabels],
                plugins: {
                    datalabels: {
                        formatter: (value, dnct1) => {
                            let sum = 0;
                            let dataArr = dnct1.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += Number(data);
                            });

                            let percentage = (value * 100 / sum).toFixed(2) + '%';
                            return percentage;
                        },
                        backgroundColor: "rgb(255,255,255,0.6)",
                        borderRadius: 4,
                        anchor: 'center',
                        align: 'center',
                        color: 'black',
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
            },
        });

    };
}

