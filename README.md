# Lambo

## Basic Concept

### Manolo Fortich Agricultural Mapping & Yield Prediction System

Lambo maps **what crops are currently being grown** in different agricultural areas of Manolo Fortich.

AI then uses historical and current agricultural data to estimate:

> **How much yield can we expect this year?**

## 1. Crop Mapping

The map can show different crop areas:

- Corn
- Rice
- Cassava


For example:

```text
		  MANOLO FORTICH

	 +-------------------------+
	 | Cassava                 |
	 |                         |
	 |      Corn               |
	 |                         |
	 |             Cassava     |
	 |                         |
	 |   Rice                  |
	 +-------------------------+
```

When an agricultural area is selected, the platform can show:

> **Crop:** Corn
>
> **Area:** 12.4 hectares
>
> **Planting Season:** June 2026
>
> **Farmers:** 18
>
> **Estimated Yield:** 52.3 tons

Lambo maps agricultural information by area. It does not track individual customers.

## 2. Yield Prediction

This is where the AI comes in. Instead of predicting what should be planted, it predicts the expected harvest.

### Corn

**2025 Actual Yield**

- 48.2 tons

**2026 Current Estimate**

- **53.7 tons**

**Prediction**

- **+11.4%**

The model could consider:

- Crop type
- Planted area
- Historical yield
- Planting date
- Rainfall
- Temperature
- Weather conditions
- Previous year's production

```text
Farm/Crop Data
	|
Historical Yield
	|
Weather Data
	|
	AI
	|
Estimated Yield
	|
Map Visualization
```

## 3. Municipal Agricultural Dashboard

The dashboard can summarize agricultural production across the municipality:

| Crop | Area Planted | Estimated Yield |
| --- | ---: | ---: |
| Corn | 1,240 ha | 5,320 tons |
| Rice | 420 ha | 1,680 tons |
| Cassava | 850 ha | 2,400 tons |

**Total estimated agricultural production for 2026:**

> **9,400 tons**

## Predictive Map

The map itself can be predictive. For example, a user can select:

> **Crop:** Corn
>
> **Year:** 2026

The map then shows corn-producing areas and each area's predicted yield:

```text
Green   80-100 tons
Yellow  50-79 tons
Orange  20-49 tons
Red     Less than 20 tons
```

Selecting an area can show:

> **Barangay X**
>
> **Corn Area:** 38 hectares
>
> **Historical Average:** 3.9 tons/ha
>
> **2026 Predicted Yield:** 4.3 tons/ha
>
> **Estimated Production:** 163.4 tons

Basic PHP project structure.

## Structure

- `index.php` - application entry point
- `css/` - stylesheets
- `js/` - browser JavaScript
- `includes/` - shared PHP files
- `resources/` - templates, data, and other application resources

