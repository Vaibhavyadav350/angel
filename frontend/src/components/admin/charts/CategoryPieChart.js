import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { formatPrice } from '../../../utils/helpers';

const COLORS = ['#A89078', '#CBB99F', '#E2D1B9', '#8C7864', '#594A3C'];

const CategoryPieChart = ({ data }) => {
    return (
        <div className="bg-white p-6 border border-bronze/10 rounded-lg h-[400px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-bronze/40 mb-6">Niche Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="sales"
                        nameKey="_id"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #A8907820',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value) => formatPrice(value)}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryPieChart;
