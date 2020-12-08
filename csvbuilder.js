class CSVBuilder {
    constructor() {
        this.points = [];
    }
    addPoint(point) {
        if (point.lat && point.lon) {
            this.points.push(point);
        }
        else throw Error("Point has to have 'lat' and 'lon'");
    }
    toCSV() {
        let csv_string = `time,lat,lon
`;
    for (let i of this.points) {
        csv_string += `"${new Date(i.at * 1000).toISOString()}","${i.lat}","${i.lon}"
`;
    }
return csv_string;
    }
}