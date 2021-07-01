import { useFocusEffect } from "@react-navigation/native";
import { Content, Tab, Tabs, Toast } from "native-base";
import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import appApi from "../../../api/appApi";
import CustomHeader from "../../../components/CustomHeader";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import DealProgress from "../../BA/DealProgress/DealProgress";
import CloseDealForm from "./CloseDealForm";

const CloseDeal = ({ route, navigation }) => {
  const { transaction_id } = route.params;


  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState();
  const [checklist, setChecklist] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchTransaction(transaction_id);
    }, [])
  );


  const fetchTasks = async (id) => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/fetch_tasks.php?property_transaction_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setChecklist(response.data.response.data);
      }
      setIsLoading(false);
    } catch (error) {
      displayError(error);
      setIsLoading(false);
    }
  };

  const fetchTransaction = async (id) => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_transaction_details.php?transaction_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setTransaction(response.data.response.data[0]);
        fetchTasks(response.data.response.data[0].property_id);
        setIsLoading(false);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      displayError(error);
    }
  };

  if (isLoading) {
    return (
      <LogoPage dontShow={true}>
        <ActivityIndicator color={colors.white} size="large" />
      </LogoPage>
    );
  }



  return (
    <React.Fragment>
      {/* <CustomHeader navigation={navigation} /> */}
      <Tabs tabBarUnderlineStyle={{ backgroundColor: colors.white }}>
        <Tab
          tabStyle={{ backgroundColor: colors.bgBrown }}
          activeTabStyle={{ backgroundColor: colors.bgBrown }}
          heading="Deal Progress"
          textStyle={{ color: colors.white }}
          activeTextStyle={{ color: colors.white }}
        >
          <DealProgress transaction={transaction} />
        </Tab>
        <Tab
          heading="Close Deal"
          tabStyle={{ backgroundColor: colors.bgBrown }}
          activeTabStyle={{ backgroundColor: colors.bgBrown }}
          textStyle={{ color: colors.white }}
          activeTextStyle={{ color: colors.white }}
        >
          <CloseDealForm transaction={transaction_id} checklist={checklist} />
        </Tab>
      </Tabs>
    </React.Fragment>
  );
};

export default CloseDeal;
