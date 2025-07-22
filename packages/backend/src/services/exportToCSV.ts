import fs from "fs";

export function jsonToCSV(jsonData: any[]): string {
    const csvRows: string[] = [];
    const headers: string[] = Object.keys(jsonData[0]);
    csvRows.push(headers.join(','));

    for (const row of jsonData) {
        const values: string[] = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
}

export function saveCSV(jsonData: any[], filename: string): void {
    if (!filename.endsWith('.csv')) {
        filename += '.csv';
    }
    const csvString: string = jsonToCSV(jsonData);
    const fullPath: string = `C:\\Depark\\depark\\packages\\backend\\CSVExplor\\${filename}`;
    fs.writeFileSync(fullPath, csvString, 'utf8');
}
