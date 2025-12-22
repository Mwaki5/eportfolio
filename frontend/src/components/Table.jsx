import React from 'react'

const Table = (data) => {
    const d = [{ h: home }, { k: j }]
    return (
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                
                    <th scope="col" class="p-4">
                        <div class="flex items-center">

                            <label for="checkbox-all" class="">S/No</label>
                        </div>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Student name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Unit Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Assessment No.
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Marks
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="w-4 p-4">
                        <div class="flex items-center">

                            <label for="checkbox-table-1" class="">1</label>
                        </div>
                    </td>
                    <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap ">
                        Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">
                        Silver
                    </td>
                    <td class="px-6 py-4">
                        Laptop
                    </td>
                    <td class="px-6 py-4">
                        $2999
                    </td>
                    <td class=" flex justify-center gap-x-2 px-6 py-4">
                        <div class=" rounded-sm px-3 py-1 font-medium text-white bg-green-600 dark:bg-green-500 hover:underline"
                            onClick={() => editModalRef.current.open()}
                        >Edit</div>
                        <div class=" rounded-sm px-3 py-1 font-medium bg-red-600 dark:bg-red-500 hover:underline text-white"
                            onClick={() => deleteModalRef.current.open()}
                        >Delete</div>
                    </td>
                </tr>

            </tbody>
        </table>
    )
}

export default Table
