import { useScore } from "@/queries/student.query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";



const ScoreChart = () => {
    const { data } = useScore()
    const score = data?.data
    return (
        <div className="w-full h-80 bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm font-semibold mb-2">Subject Scores</h2>
            {score?.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={score}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#099885" barSize={38} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-md text-gray-500 mt-15 text-center">No Score yet</div>
            )}

        </div>
    );
};

export default ScoreChart;