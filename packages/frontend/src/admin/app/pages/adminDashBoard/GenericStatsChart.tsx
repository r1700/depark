import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, Tooltip, Legend, Cell, LabelList,
  PieChart, Pie,
  CartesianGrid,
} from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A28FD0', '#FF6666', '#33CC33', '#FF9933',
  '#6C5B7B', '#355C7D',
];

const FONT_FAMILY = "'Inter', sans-serif";

interface GenericStatsChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  barKeys: string[];
  pieKeys: string[];
  xLabel?: string;
}

const GenericStatsChart: React.FC<GenericStatsChartProps> = ({
  data,
  xKey,
  barKeys,
  pieKeys,
  xLabel,
}) => {
  const [showBar, setShowBar] = useState(true);

  const formattedData = data.map(item => {
    const newItem = { ...item };
    [...barKeys, ...pieKeys].forEach(key => {
      newItem[key] = Number(item[key]) || 0;
    });
    return newItem;
  });

  const colorsByEntry = data.map((_, idx) => COLORS[idx % COLORS.length]);

  const pieData = formattedData.map((item, idx) => ({
    name: item[xKey],
    value: pieKeys.reduce((sum, key) => sum + (item[key] || 0), 0),
    color: colorsByEntry[idx % colorsByEntry.length],
  }));

  const toggleButtonLabel = showBar ? 'הצג גרף עוגה' : 'הצג גרף בר';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      padding: 40,
      fontFamily: FONT_FAMILY,
      height: '90vh',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {showBar ? (
          <ResponsiveContainer width="60%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              barCategoryGap={12}
              barGap={6}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <CartesianGrid vertical={false} horizontal={true} strokeDasharray="3 3" stroke="#ccc" />

              <XAxis
                dataKey={xKey}
                interval={0}
                angle={0}
                textAnchor="middle"
                height={60}
                tick={{ fontSize: 14, fill: '#333' }}
                label={{ value: xLabel || '', position: 'insideBottom', offset: 0, fontSize: 16 }}
              />
              {/* מסירים את YAxis */}
              {/* אם בכל זאת רוצים ציר Y ללא תוויות: ניתן לכתוב:
              <YAxis hide={true} />
              */}
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ fontSize: 14 }} />
              <Legend wrapperStyle={{ fontSize: 14, paddingTop: 10 }} />
              {barKeys.map((key) => (
                <Bar key={key} dataKey={key} isAnimationActive={false}>
                  {formattedData.map((entry, idx) => (
                    <Cell
                      key={`cell-bar-${idx}-${key}`}
                      fill={colorsByEntry[idx % colorsByEntry.length]}
                    />
                  ))}
                  <LabelList dataKey={key} position="inside" style={{ fill: '#fff', fontWeight: '600', fontSize: 14 }} />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="40%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={120}
                dataKey="value"
                fill="#8884d8"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-pie-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <button
        onClick={() => setShowBar(!showBar)}
        style={{
          padding: '10px 20px',
          fontSize: 16,
          cursor: 'pointer',
          borderRadius: 5,
          border: 'none',
          backgroundColor: '#0088FE',
          color: 'white',
          fontWeight: '600',
          width: 160,
          marginTop: 10,
        }}
      >
        {toggleButtonLabel}
      </button>
    </div>
  );
};

export default GenericStatsChart;