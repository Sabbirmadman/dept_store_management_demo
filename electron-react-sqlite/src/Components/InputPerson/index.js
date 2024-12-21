export const InputPerson = ({ fetchData }) => {
    const onSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name?.value;
        const age = e.target.age?.value;
        if (!name || !age) return;

        window.sqlite.personDB?.insertPerson(name, parseInt(age));
        setTimeout(() => {
            fetchData();
        }, 200);
        e.target.reset();
    };

    return (
        <>
            <form className="flex space-y-2" onSubmit={onSubmit}>
                <fieldset>
                    <legend>Enter Details</legend>
                    <div className="space-y-2 flex gap-4">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" />
                    </div>
                    <div className="space-y-2 flex gap-4">
                        <label htmlFor="age">Age</label>
                        <input type="number" id="age" name="age" />
                    </div>
                    <div className="mt-5 h-10 w-full flex ">
                        <input
                            type="submit"
                            value="ADD"
                            className="h-full w-full bg-blue-500 text-white rounded-md cursor-pointer"
                        />
                    </div>
                </fieldset>
            </form>
        </>
    );
};
