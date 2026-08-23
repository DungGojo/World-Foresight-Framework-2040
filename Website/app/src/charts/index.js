// Topic-1 originals (bespoke to Power's figures)
import ShareLines from './ShareLines';
import OrbitMap from './OrbitMap';
import IssueDials from './IssueDials';
import PowerRadar from './PowerRadar';
import TwoSpeed from './TwoSpeed';
import TechDominanceBar from './TechDominanceBar';
import SignatureMap from './SignatureMap';
import SplitTracks from './SplitTracks';
import PostureFlags from './PostureFlags';

// Generic types added for Topics 2-5 — each is data-driven and reused across
// topics rather than rebuilt per finding.
import QuadrantScatter from './QuadrantScatter';
import SlopeChart from './SlopeChart';
import RankedBar from './RankedBar';
import DivergingBar from './DivergingBar';
import TrendLine from './TrendLine';
import PanelTrends from './PanelTrends';
import StackedArea from './StackedArea';
import StackedColumns from './StackedColumns';
import CounterStrip from './CounterStrip';
import Dumbbell from './Dumbbell';
import FunnelPanels from './FunnelPanels';
import StatTable from './StatTable';
import VennThree from './VennThree';
import ScenarioBullet from './ScenarioBullet';
import RankSwap from './RankSwap';
import LayerStack from './LayerStack';
import MethodCompare from './MethodCompare';
import HeatBars from './HeatBars';
import TimeBars from './TimeBars';
import PairedBars from './PairedBars';
import FlagColumns from './FlagColumns';

// Chart registry: figure.type (from the content module) -> component.
export const CHARTS = {
  ShareLines, OrbitMap, IssueDials, PowerRadar,
  TwoSpeed, TechDominanceBar, SignatureMap,
  SplitTracks, PostureFlags,
  QuadrantScatter, SlopeChart, RankedBar, DivergingBar, TrendLine,
  PanelTrends, StackedArea, StackedColumns, CounterStrip, Dumbbell, FunnelPanels, StatTable,
  VennThree, ScenarioBullet, RankSwap, LayerStack, MethodCompare,
  HeatBars, TimeBars, PairedBars, FlagColumns,
};
