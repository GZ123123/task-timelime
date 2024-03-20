import types from "prop-types";

import { GroupConsumer } from './GroupProvider'

const Group = ({ id }) => {
  return <div>{id}</div>
}

Group.propTypes = {
  id: types.string
}

const GroupWrapper = (props) => {
  return <GroupConsumer>
    {({_props}) => <Group {...props} {..._props} />}
  </GroupConsumer>
}

export default GroupWrapper