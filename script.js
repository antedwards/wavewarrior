let race;
let all_data;
let leaderboard;
let gpx_builder = new GPXBuilder('Wave Warrior - TWAC 2020');
let csv_builder = new CSVBuilder();

const team_id = 4;
const race_id = 'yjdnsl599';
const parse = (e) => {
    for (var t = new DataView(e), i = t.getUint8(0), a = 1 === (1 & i), s = 2 === (2 & i), n = 4 === (4 & i), r = 8 === (8 & i), o = t.getUint32(1), l = 5, c = []; l < e.byteLength;) {
        var u = t.getUint16(l);
        l += 2;
        var h = t.getUint16(l),
            d = new Array(h);
        l += 2;
        for (var g = void 0, v = 0; v < h; v++) {
            var p = t.getUint8(l),
                m = {};
            if (128 === (128 & p)) {
                var w = t.getUint16(l);
                l += 2;
                var y = t.getInt16(l);
                l += 2;
                var M = t.getInt16(l);
                if (l += 2, a && (m.alt = t.getInt16(l), l += 2), s) {
                    var f = t.getInt16(l);
                    l += 2, m.dtf = g.dtf + f, n && (m.lap = t.getUint8(l), l++)
                }
                r && (m.pc = t.getInt16(l) / 32e3, l += 2), w = 32767 & w, m.lat = g.lat + y, m.lon = g.lon + M, m.at = g.at - w, m.pc = g.pc + m.pc
            } else {
                var T = t.getUint32(l);
                l += 4;
                var b = t.getInt32(l);
                l += 4;
                var L = t.getInt32(l);
                if (l += 4, a && (m.alt = t.getInt16(l), l += 2), s) {
                    var x = t.getInt32(l);
                    l += 4, m.dtf = x, n && (m.lap = t.getUint8(l), l++)
                }
                r && (m.pc = t.getInt32(l) / 21e6, l += 4), m.lat = b, m.lon = L, m.at = o + T
            }
            d[v] = m, g = m
        }
        d.forEach(function(e) {
            e.lat /= 1e5, e.lon /= 1e5
        }), c.push({
            id: u,
            moments: d
        })
    }
    return c;
}
const loadRaceData = async () => {
    race = await fetch(`https://yb.tl/JSON/${race_id}/RaceSetup`)
    .then(response => response.json());
}
const loadAllData = async () => {
    let data = await fetch(`https://yb.tl/BIN/${race_id}/AllPositions3`)
    .then(response => response.arrayBuffer())
    all_data = parse(data);
}
const getTeamData = () => {
    let team_data = all_data.filter(team => team.id === team_id)[0];
    return team_data.moments;
}
const getTeam = () => {
    return race.teams.filter(team => team.id === team_id)[0];
}
const downloadFile = (filename, content, type) => {
    const blob = new Blob(
        [ content ],
        { type }
      );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
        setTimeout(() => {
        URL.revokeObjectURL(url);
        this.removeEventListener('click', clickHandler);
        }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
}
const downloadGPX = () => {
    downloadFile('Wave Warrior - TWAC 2020.gpx', gpx_builder.toXML(), 'application/gpx+xml');
}
const downloadCSV = () => {
    downloadFile('Wave Warrior - TWAC 2020.csv', csv_builder.toCSV(), 'text/csv');
}
const load = async () => {
    await loadRaceData();
    await loadAllData();
    let data = getTeamData();
    let team = getTeam();
    $('#teamName').text(team.name)
    data = data.reverse();
    for (let i of data) {
        gpx_builder.addPoint(i);
        csv_builder.addPoint(i);
        $('table tbody').append('<tr />').children('tr:last')
        .append(`<th>${new Date(i.at * 1000).toISOString()}</th>`)
        .append(`<td>${i.lat}</td>`)
        .append(`<td>${i.lon}</td>`)
    }
    $('#downloadCSV').show();
    $('#downloadGPX').show();
    $('#loadingSpinner').hide();
    $('#downloadGPX').click(() => {
        downloadGPX();
    });
    $('#downloadCSV').click(() => {
        downloadCSV();
    });
}
load();
