import DataTable from "./components/DataTable/DataTable";
import { sampleData } from "./data/sampleData";

export default function App() {

    return (
        <div>
            <h1>Cemento Table Assignment</h1>

            <DataTable
                columns={sampleData.columns}
                data={sampleData.data}
            />
        </div>
    );
}