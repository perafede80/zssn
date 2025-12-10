import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { survivorTradeItems } from "../api/survivorApi";
import IconRenderer from "../components/IconRenderer";
import itemPoints from "../constants/itemPoints";
import type { InventoryItem, Survivor } from "../models/survivor.model";

const TradeInterfacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const survivor = location.state?.survivor as Survivor | undefined;
  const tradingWith = location.state?.tradingWith as Survivor | undefined;

  const [selectedItemsA, setSelectedItemsA] = useState<Record<string, number>>(
    {}
  );
  const [selectedItemsB, setSelectedItemsB] = useState<Record<string, number>>(
    {}
  );
  const { t } = useTranslation();

  if (!survivor || !tradingWith) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">
          {t("TRADE_INTERFACE_PAGE.INVALID_TRADE")}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/trade")}>
          {t("TRADE_INTERFACE_PAGE.BUTTON.BACK")}
        </Button>
      </Box>
    );
  }

  const modifySelection = (
    owner: "A" | "B",
    itemName: string,
    change: number,
    maxQuantity: number
  ) => {
    const normalizedItem = itemName.toUpperCase();
    const setSelectedItems =
      owner === "A" ? setSelectedItemsA : setSelectedItemsB;

    setSelectedItems((prev) => {
      const newItems = { ...prev };
      const newQuantity = (newItems[normalizedItem] || 0) + change;

      if (newQuantity <= 0) {
        delete newItems[normalizedItem];
      } else if (newQuantity <= maxQuantity) {
        newItems[normalizedItem] = newQuantity;
      }

      return newItems;
    });
  };

  const calculateTotalPoints = (items: Record<string, number>) => {
    return Object.entries(items).reduce((total, [item, qty]) => {
      const normalizedItem = item.toUpperCase(); // Ensure case consistency
      return total + (itemPoints[normalizedItem] || 0) * qty;
    }, 0);
  };

  const handleConfirmTrade = async () => {
    if (!survivor?.id || !tradingWith?.id) {
      alert("Invalid survivor IDs for trading.");
      return;
    }

    try {
      //TODO: Add response type
      const response = await survivorTradeItems(
        survivor.id.toString(),
        tradingWith.id.toString(),
        selectedItemsA,
        selectedItemsB
      );

      if (!response.ok) {
        console.error("Trade failed:", response);
        const errorData = await response.json();
        //TODO: Create a custom error type for api errors
        throw new Error(errorData.message || "Trade failed");
      }

      //alert('Trade successful!');
      <section>
        <div role="alert" aria-busy="false">
          Trade Successful!
        </div>
      </section>;

      navigate("/survivors/");
    } catch (error) {
      console.error("Trade error:", error);
      if (error instanceof TypeError) {
        alert("Network error - Check your connection");
      } else if (error instanceof Error) {
        alert(`Trade failed: ${error.message}`);
      } else {
        alert(`Trade failed due to an unknown error: ${String(error)}`);
      }
    }
  };

  const totalPointsA = calculateTotalPoints(selectedItemsA);
  const totalPointsB = calculateTotalPoints(selectedItemsB);
  const isTradeValid = totalPointsA > 0 && totalPointsA === totalPointsB;

  return (
    <Container
      data-testid="trade-selection-page"
      maxWidth="md"
      sx={{ textAlign: "center", py: 4 }}
    >
      <Typography variant="h4" textAlign="center">
        {t("TRADE_INTERFACE_PAGE.TRADE_BETWEEN", {
          survivor: survivor.name,
          tradingWith: tradingWith.name,
        })}
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ mt: 2 }}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 3, width: 325, height: 250 }}>
            <Typography variant="h6">
              {t("TRADE_INTERFACE_PAGE.SURVIVOR_NAME_INVENTORY", {
                survivor: survivor.name,
              })}{" "}
            </Typography>
            {survivor.inventory?.length ? (
              survivor.inventory.map((item: InventoryItem, index) => (
                <Box
                  key={index.toString()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    {item.quantity - (selectedItemsA[item.item] || 0)}x{" "}
                    {item.item}
                    {
                      <IconRenderer
                        item={item.item}
                        sx={{ ml: 0.5, fontSize: 16 }}
                      />
                    }
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      disabled={
                        (selectedItemsA[item.item] || 0) >= item.quantity
                      }
                      onClick={() =>
                        modifySelection("A", item.item, 1, item.quantity)
                      }
                    >
                      <AddIcon />
                    </IconButton>
                    <Typography>{selectedItemsA[item.item] || 0}</Typography>
                    <IconButton
                      disabled={!selectedItemsA[item.item]}
                      onClick={() =>
                        modifySelection("A", item.item, -1, item.quantity)
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">
                {t("COMMON.NO_INVENTORY")}
              </Typography>
            )}

            {Object.keys(selectedItemsA).length > 0 && (
              <Typography variant="h6">
                {t("TRADE_INTERFACE_PAGE.TOTAL_POINTS")}
                {totalPointsA}
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: 3, width: 325, height: 250 }}>
            <Typography variant="h6">
              {t("TRADE_INTERFACE_PAGE.SURVIVOR_NAME_INVENTORY", {
                survivor: tradingWith.name,
              })}
            </Typography>
            {tradingWith.inventory?.length ? (
              tradingWith.inventory.map((item: InventoryItem, index) => (
                <Box
                  key={index.toString()} // Fix key warning https://legacy.reactjs.org/docs/lists-and-keys.html#keys
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    {item.quantity - (selectedItemsB[item.item] || 0)}x{" "}
                    {item.item}
                    {
                      <IconRenderer
                        item={item.item}
                        sx={{ ml: 0.5, fontSize: 16 }}
                      />
                    }
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      disabled={
                        (selectedItemsB[item.item] || 0) >= item.quantity
                      }
                      onClick={() =>
                        modifySelection("B", item.item, 1, item.quantity)
                      }
                    >
                      <AddIcon />
                    </IconButton>
                    <Typography>{selectedItemsB[item.item] || 0}</Typography>
                    <IconButton
                      disabled={!selectedItemsB[item.item]}
                      onClick={() =>
                        modifySelection("B", item.item, -1, item.quantity)
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">
                {t("COMMON.NO_INVENTORY")}
              </Typography>
            )}
            {Object.keys(selectedItemsB).length > 0 && (
              <Typography variant="h6">
                {t("TRADE_INTERFACE_PAGE.TOTAL_POINTS")} {totalPointsB}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button
          data-testid="button"
          variant="contained"
          color="primary"
          onClick={handleConfirmTrade}
          disabled={!isTradeValid}
        >
          {t("TRADE_INTERFACE_PAGE.BUTTON.CONFIRM")}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/trade/select", { state: { survivor } })}
        >
          {t("COMMON.BUTTON.CANCEL")}
        </Button>
      </Stack>
    </Container>
  );
};

export default TradeInterfacePage;
