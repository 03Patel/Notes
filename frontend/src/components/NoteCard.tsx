import React from 'react';


const NoteCard = ({ note, onDelete }: any) => {
return (
<div className="bg-white p-4 rounded shadow-sm">
<h3 className="font-semibold">{note.title}</h3>
<p className="text-sm mt-2">{note.content}</p>
<div className="mt-3 text-right">
<button onClick={() => onDelete(note._id)} className="text-red-600 text-sm">Delete</button>
</div>
</div>
);
};


export default NoteCard;