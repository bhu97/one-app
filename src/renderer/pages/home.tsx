import React from 'react';
import Sidebar from 'renderer/components/ui/Sidebar';



export class HomePage extends React.Component{
  render() {
    return (
    <main>
      <Sidebar navigationEnabled={true}></Sidebar>
    </main>
    );
  }
}