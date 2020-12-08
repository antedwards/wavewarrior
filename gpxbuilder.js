class GPXBuilder {
    constructor(name) {
        this.points = [];
        this.name = name;
    }
    addPoint(point) {
        if (point.lat && point.lon) {
            this.points.push(point);
        }
        else throw Error("Point has to have 'lat' and 'lon'");
    }
    toXML() {
        let xml_string = `<?xml version="1.0"?>
<gpx
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.topografix.com/GPX/1/1"
    xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
    version="1.1"
    creator="${this.name}" >
    <metadata>
        <name>${this.name}</name>
        <time>${new Date().toISOString()}</time>
    </metadata>
    <trk>
        <name>RowboatEh</name>
        <trkseg>`;
    for (let i of this.points) {
        xml_string += `
            <trkpt lat="${i.lat}" lon="${i.lon}">
                <time>${new Date(i.at * 1000).toISOString()}</time>
            </trkpt>`;
    }
    xml_string += `
        </trkseg>
    </trk>
</gpx>`;
return xml_string;
    }
}