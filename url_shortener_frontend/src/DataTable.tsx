// DataTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // or use fetch

type DataRow = Record<string, string | number | boolean | null>;

interface DataTableProps {
    data: DataRow[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {

    if (data.length === 0) {
        return <p>No data available.</p>;
    }

    const incrementVisitCount = async (id: number) => {
        try {
            const response = await axios.post('http://localhost:8080/api/increment_visit_count', { id: id }); // change to your API URL
            // setStatus(`Success! The URL has been shortened.`);

        } catch (error: any) {
            // setStatus(`This URL has already been shortened`);
        }

    }



    const headers = Object.keys(data[0]);

    const handleRowClick = (url?: string | null, id?: number | null) => {
        console.log('handleRowClick')
        console.log(url)
        if (typeof url === 'string' && url.trim() !== '') {
            window.open(url, '_blank');
        }
        incrementVisitCount(Number(id))
    };

    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header} style={{ border: '1px solid #ccc', padding: '8px' }}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        onClick={() => handleRowClick(String(row.original_url), Number(row.id))}
                    >

                        {headers.map((header) => (
                            <td key={header} style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {String(row[header])}
                            </td>
                        ))}

                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;