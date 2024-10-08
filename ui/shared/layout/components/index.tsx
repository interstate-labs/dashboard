import dynamic from 'next/dynamic';

import Footer from 'ui/snippets/footer/Footer';
const TopRow = dynamic(() => import('ui/snippets/topBar/TopBar'), { ssr: false });

import Container from './Container';
import Content from './Content';
import MainArea from './MainArea';
import MainColumn from './MainColumn';
import NavBar from './NavBar';
import SideBar from './SideBar';

export {
  Container,
  Content,
  MainArea,
  SideBar,
  NavBar,
  MainColumn,
  Footer,
  TopRow,
};

// Container
//    TopRow
//    MainArea
//       SideBar
//       MainColumn
//          Content
//    Footer
