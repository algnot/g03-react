import React from 'react'
import Navbar from '../../component/navbar/navbar'
import Search from '../../component/search/search'

export default function Message() {
    return (
      <div>
        <Navbar />
        <div className="content">
          <div>
              {/* content here */}
          </div>
          <Search />
        </div>
      </div>
    )
}
