// import React from "react";

// const BlogDetails = ({ post }) => {
//   return (
//     <div className="mt-[50px]">
//       <a href={post.href}>
//         <span className="font-bold">{post.titles}</span>
//       </a>
//       <p>
//         <span className="italic text-sm"> {post.upVotes}</span> {/*upvote*/}
//         By
//         <span className="italic text-sm"> {post.author}</span> {/*authorName*/}
//       </p>
//       <p className="text-sm mb-5"> Posted on {post.times} </p> {/*datetime*/}
//       <a className="text-md"> {post.comments}</a>
//     </div>
//   );
// };

// export default BlogDetails;

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';





export default function BasicTable({post}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            
          </TableRow>
        </TableHead>
        <TableBody>
          <TableCell>
            <a href={post.href}>{post.titles} </a>
            <br/>
            <div >
              <span>{post.upVotes}</span>{" | "}
              <span>{post.times}</span>{" | "}
              <span>{post.comments}</span>{" | "}

            </div>



          </TableCell>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
