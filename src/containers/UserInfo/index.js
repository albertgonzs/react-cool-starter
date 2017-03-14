/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import Helmet from 'react-helmet';

import * as action from './action';
import type { UserInfo as UserInfoType, Dispatch, Reducer } from '../../types';
import UserCard from '../../components/UserCard';
import styles from './styles.scss';

type Props = {
  userInfo: UserInfoType,
  match: Object,
  dispatch: Dispatch,
};

class UserInfo extends PureComponent {
  props: Props;

  static defaultProps: {
    userInfo: {
      readyStatus: '',
      info: {
        name: '',
        phone: '',
        email: '',
        website: '',
      },
    },
    match: null,
    dispatch: () => void,
  };

  // Fetching data method for both server/client side rendering
  static fetchData(dispatch, params) {
    return [
      dispatch(action.fetchDataIfNeeded(params.id)),
    ];
  }

  componentDidMount() {
    const { dispatch, match: { params } } = this.props;

    // Fetching data for client side rendering
    UserInfo.fetchData(dispatch, params);
  }

  displayUserCard = () => {
    const { userInfo, match: { params } } = this.props;
    const userInfoById = userInfo[params.id];

    if (!userInfoById || userInfoById.readyStatus === action.AN_USER_REQUESTING) {
      return <p>Loading...</p>;
    }

    if (userInfoById.readyStatus === action.AN_USER_FAILURE) {
      return <p>Oops, Failed to load info!</p>;
    }

    return <UserCard info={userInfoById.info} />;
  }

  render() {
    return (
      <div className={styles.UserInfo}>
        <Helmet title="User Info" />
        {this.displayUserCard()}
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ userInfo }: Reducer) => ({ userInfo }),
);

export default connector(UserInfo);
