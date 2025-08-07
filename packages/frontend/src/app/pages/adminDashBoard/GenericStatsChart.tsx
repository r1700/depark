import React from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';

// צבעים למקסימום 10 אובייקטים
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A28FD0', '#FF6666', '#33CC33', '#FF9933',
  '#6C5B7B', '#355C7D',
];

const FONT_FAMILY = "'Inter', sans-serif";

interface GenericStatsChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  barKeys: string[];  // כמה מאפיינים להציג ב-bar
  pieKeys: string[];  // שדות לסכום בפאי
  xLabel?: string;
}

const GenericStatsChart: React.FC<GenericStatsChartProps> = ({
  data,
  xKey,
  barKeys,
  pieKeys,
  xLabel,
}) => {
  // המרה למספרים
  const formattedData = data.map(item => {
    const newItem = { ...item };
    [...barKeys, ...pieKeys].forEach(key => {
      newItem[key] = Number(item[key]) || 0;
    });
    return newItem;
  });

  // צבע לפי index של אובייקט - צבע אחיד לאורך כל הפסים (barKeys) של אותו אובייקט
  const colorsByEntry = data.map((_, idx) => COLORS[idx % COLORS.length]);

  // נתוני הפאי: סכום כל הpieKeys לכל אובייקט
  const pieData = formattedData.map((item, idx) => ({
    name: item[xKey],
    value: pieKeys.reduce((sum, key) => sum + (item[key] || 0), 0),
    color: colorsByEntry[idx % colorsByEntry.length],
  }));

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      padding: 40,
      gap: 50,
      height: '90vh',
      fontFamily: FONT_FAMILY,
    }}>

      {/* BarChart */}
      <ResponsiveContainer width="50%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          barCategoryGap={12}
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            interval={0}
            angle={0}         // תוויות ישרות
            textAnchor="middle"
            height={60}
            tick={{ fontSize: 14, fill: '#333' }}
            label={{ value: xLabel || '', position: 'insideBottom', offset: 0, fontSize: 16 }}
          />
          <YAxis
            tick={{ fontSize: 14, fill: '#333' }}
            label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 0, fontSize: 16 }}
          />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ fontSize: 14 }} />
          <Legend wrapperStyle={{ fontSize: 14, paddingTop: 10 }} />

          {/* 
            לכל מאפיין ב-barKeys נוצרים פסים בעצמם,
            צבע כל פס לפי צבע האובייקט שלו ולא לפי ה-key
          */}
          {barKeys.map((key, keyIdx) => (
            <Bar key={key} dataKey={key} isAnimationActive={false}>
              {formattedData.map((entry, idx) => (
                <Cell
                  key={`cell-bar-${idx}-${key}`}
                  fill={colorsByEntry[idx % colorsByEntry.length]}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* PieChart מלא */}
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
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip />
          {/* מסירים את הלג'נד כדי לא לחזור על התוויות */}
          {/* <Legend /> */}
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default GenericStatsChart;