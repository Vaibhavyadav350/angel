import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { formatPrice } from '../../../utils/helpers';

const SalesAreaChart = ({ data }) => {
    return (
        <div className="bg-white p-6 border border-bronze/10 rounded-lg h-[400px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-bronze/40 mb-6">Revenue Growth (Daily)</h3>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A89078" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#A89078" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="_id"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#A89078', opacity: 0.6 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#A89078', opacity: 0.6 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #A8907820',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value) => [formatPrice(value), 'Revenue']}
                        labelStyle={{ fontSize: '10px', color: '#A89078', fontWeight: 'bold' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#A89078"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesAreaChart;
