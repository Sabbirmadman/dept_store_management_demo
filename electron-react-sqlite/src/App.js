import { useEffect, useState } from "react";
import { Display } from "./Components/home";
import { InputPerson } from "./Components/InputPerson";
import { useCallback } from "react";

function App() {
    const [data, setData] = useState([]);

    const fetchData = useCallback(() => {
        const data = window.sqlite.personDB?.readAllPerson();
        setData(data);
    }, []);

    const removeSinglePerson = useCallback(
        (id) => {
            window.sqlite.personDB?.removePerson(id);
            fetchData();
        },
        [fetchData]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-blue-200 p-4 rounded-md shadow-md w-96 space-y-4">
                    <InputPerson fetchData={fetchData} />
                    <Display
                        data={data}
                        removeSinglePerson={removeSinglePerson}
                    />
                </div>
            </div>
        </>
    );
}

export default App;
