import fs from "fs";
import path from "path";

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

export const saveCSV = (jsonData: any[], filename: string): void => {
    if (!filename.endsWith('.csv')) {
        filename += '.csv';
    }
    
    const dirPath = path.join(process.cwd(), './CSVExplor'); 
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); 
    }
    
    const csvString: string = jsonToCSV(jsonData);
    const fullPath: string = path.join(dirPath, filename); 
    fs.writeFileSync(fullPath, csvString, 'utf8');
};
