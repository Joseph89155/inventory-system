import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const LineChart = ({ data, xKey, yKey }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ReLineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
    </ReLineChart>
  </ResponsiveContainer>
);

export const BarChart = ({ data, xKey, yKey }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ReBarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={yKey} fill="#82ca9d" />
    </ReBarChart>
  </ResponsiveContainer>
);

export const PieChart = ({ data, nameKey, valueKey }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RePieChart>
      <Pie
        data={data}
        dataKey={valueKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </RePieChart>
  </ResponsiveContainer>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
