import React from 'react';

export default ({ comments }) => {
    const renderedComments = comments.map(comment => <li key={comment.id}>{comment.content}</li>);

    return <div>
        {renderedComments}
    </div>;
};