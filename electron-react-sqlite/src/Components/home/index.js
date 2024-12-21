export const Display = ({ data, removeSinglePerson }) => {
    return (
        <>
            {data.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nickname</th>
                                <th>Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                removeSinglePerson(item.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};
