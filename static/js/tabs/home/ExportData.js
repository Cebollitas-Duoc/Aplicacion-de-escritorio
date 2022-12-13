class ExportData{
    static async createCSV(){
        var csv =  "id reserva, direccion, usuario, rut, fecha inicio, fecha fin, fecha creacion, estado, valor\n"
        const reservas = await ReserveManager.getReserves();
        reservas.forEach(function(rsv) {
            csv += `${rsv.Id_Reserve}, ${rsv.Address}, ${rsv.UserName}, ${rsv.Rut}, ${rsv.StartDate}, ${rsv.EndDate}, ${rsv.CreateDate}, ${rsv.Estado}, ${formatterPeso.format(parseInt(rsv.Value))},`;
            csv += "\n";
        });
        
        var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          
          //provide the name for the CSV file to be downloaded
          hiddenElement.download = 'reservas.csv';
          hiddenElement.click();
      }
}