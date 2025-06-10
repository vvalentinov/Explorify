import styles from './PlaceSearchCard.module.css';

import {
    Spin,
    ConfigProvider,
    Empty,
    Input,
    Select,
    Cascader,
    Button,
    Typography,
    Radio
} from "antd";

import {
    SearchOutlined,
    AppstoreOutlined,
    GlobalOutlined,
    TagsOutlined,
} from '@ant-design/icons';

import { entityState } from '../../../constants/entityState';

import { motion, AnimatePresence } from "framer-motion";

import { PlaceSearchContext } from '../../../constants/placeSearchContext';

import { useState } from 'react';

const PlaceSearchCard = ({
    state,
    dispatch,
    categoryOptions,
    countryOptions,
    setCountryOptions,
    tags,
    isForAdmin,
    userFollowingUserName,
    skipNextSearchRef
}) => {

    const [showCategorySearch, setShowCategorySearch] = useState(false);
    const [showCountrySearch, setShowCountrySearch] = useState(false);
    const [showTagsSearch, setShowTagsSearch] = useState(false);

    const fadeSlide = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: 10,
            transition: { duration: 0.15, ease: "easeIn" }
        }
    };

    const toggleCategorySearch = () => {
        setShowCategorySearch(prev => {
            const newVal = !prev;

            if (!newVal) {
                const hadCategory = state.selectedCategoryPath?.length > 0;
                dispatch({ type: 'SET_CATEGORY', payload: [] });
                if (!hadCategory) {
                    skipNextSearchRef.current = true;
                }
            }

            return newVal;
        });
    };


    const toggleCountrySearch = () => {
        setShowCountrySearch(prev => {
            const newVal = !prev;

            if (!newVal) {
                const hadCountry = state.selectedCountryId !== null;
                dispatch({ type: 'SET_COUNTRY', payload: null });
                if (!hadCountry) {
                    skipNextSearchRef.current = true;
                }
            }

            return newVal;
        });
    };

    const toggleTagsSearch = () => {
        setShowTagsSearch(prev => {
            const newVal = !prev;

            if (!newVal) {
                const hadTags = state.selectedTagIds?.length > 0;
                dispatch({ type: 'SET_TAGS', payload: [] });
                if (!hadTags) {
                    skipNextSearchRef.current = true;
                }
            }

            return newVal;
        });
    };

    const filterOptions = [
        { label: entityState.Approved, value: entityState.Approved },
        { label: entityState.Unapproved, value: entityState.Unapproved },
        { label: 'Recently Deleted', value: entityState.Deleted },
    ];

    const handleFilterChange = (e) => {
        dispatch({ type: 'SET_FILTER', payload: e.target.value });
    };

    return (

        <div className={isForAdmin ? styles.adminSearchPanel : styles.searchPanel}>

            <div style={{ width: '100%' }}>

                <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <Typography.Title
                        level={3}
                        style={{
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                            fontWeight: 700,
                            fontSize: '2.2rem',
                            letterSpacing: '0.4px',
                            color: '#1A7F64',
                            textAlign: 'left',
                            padding: '0'
                        }}
                        className={styles.searchTitle}
                    >
                        <SearchOutlined style={{ marginRight: 10 }} />
                        {state.searchContext === PlaceSearchContext.Global && 'Search Places'}
                        {state.searchContext === PlaceSearchContext.UserPlaces && `Search in ${state.filter} Places`}
                        {state.searchContext === PlaceSearchContext.Admin && `Search in ${state.filter} Places`}
                        {state.searchContext === PlaceSearchContext.UserFollowing && `Search in ${userFollowingUserName}'s places`}
                        {state.searchContext === PlaceSearchContext.FavPlace && `Search in Favorite Places`}
                    </Typography.Title>

                </div>
            </div>

            {(state.searchContext === PlaceSearchContext.Admin || state.searchContext === PlaceSearchContext.UserPlaces) && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        backgroundColor: '#d0f0d8',
                        padding: '1rem 0',
                        borderRadius: '12px',
                        // border: 'solid 1px red'
                    }}
                >
                    <ConfigProvider
                        theme={{
                            components: {
                                Radio: {
                                    borderRadius: 12,
                                    colorPrimary: isForAdmin ? '#1890ff' : '#3f9142',
                                    buttonBg: isForAdmin ? '#cce4ff' : '#e0f2e5',
                                    buttonColor: isForAdmin ? '#0958d9' : '#2d6a2e',
                                    buttonSolidCheckedBg: isForAdmin ? '#1890ff' : '#3f9142',
                                    buttonSolidCheckedColor: 'white',
                                    buttonSolidCheckedHoverBg: isForAdmin ? '#1677ff' : '#357a39',
                                    buttonSolidCheckedActiveBg: isForAdmin ? '#0958d9' : '#2f6530',
                                },
                            },
                        }}
                    >
                        <Radio.Group
                            options={filterOptions}
                            defaultValue={state.filter}
                            optionType="button"
                            value={state.filter}
                            buttonStyle="solid"
                            size="large"
                            onChange={handleFilterChange}
                            name="Sort"
                            className="fullWidthRadioGroup"
                            style={{
                                display: 'flex',
                                width: '100%',
                                gap: '0.5rem',
                            }}
                        />
                    </ConfigProvider>
                </div>
            )}




            <Input
                allowClear
                size="large"
                placeholder="Start typing place name..."
                prefix={<SearchOutlined
                    style={{
                        color: isForAdmin ? '#1677ff' : '#52c41a',
                        fontSize: 20,
                        marginRight: 10
                    }}
                />}
                value={state.placeName}
                onChange={(e) => dispatch({ type: 'SET_PLACE_NAME', payload: e.target.value })}
                name="PlaceName"
                style={{
                    height: '4rem',
                    fontSize: '1.4rem',
                    paddingLeft: '12px',
                    fontFamily: 'Poppins, Segoe UI, sans-serif',
                }}
            />

            <div className={styles.toggleButtonsWrapper}>
                <Button
                    variant='solid'
                    // shape="round"
                    icon={<AppstoreOutlined />}
                    onClick={toggleCategorySearch}
                    className={`${styles.searchButtonFilter} ${showCategorySearch ? styles.active : ''}`}
                >
                    Category Search
                </Button>
                <Button
                    variant='solid'
                    // shape="round"
                    icon={<GlobalOutlined />}
                    onClick={toggleCountrySearch}
                    className={`${styles.searchButtonFilter} ${showCountrySearch ? styles.active : ''}`}
                >
                    Country Search
                </Button>
                <Button
                    variant='solid'
                    // shape="round"
                    icon={<TagsOutlined />}
                    onClick={toggleTagsSearch}
                    className={`${styles.searchButtonFilter} ${showTagsSearch ? styles.active : ''}`}
                >
                    Tags Search
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {showCategorySearch && (
                    <motion.div
                        key="categorySearch"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={fadeSlide.transition}
                        variants={fadeSlide}
                    >
                        <Cascader
                            prefix={<AppstoreOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a', fontSize: 20, marginRight: 10 }} />}
                            options={categoryOptions}
                            value={state.selectedCategoryPath}
                            onChange={(value) => dispatch({ type: 'SET_CATEGORY', payload: value })}
                            placeholder="Select category/subcategory"
                            allowClear
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                height: '4rem',
                                fontFamily: 'Poppins, Segoe UI, sans-serif',
                            }}
                            styles={{ popup: { fontSize: '1.4rem' } }}
                            className={styles.cascaderInput}
                            classNames={{ popup: { root: 'dropdownPopup' } }}
                            changeOnSelect
                            expandTrigger="hover"
                            size="large"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">

                {showCountrySearch && (
                    <motion.div
                        key="categorySearch"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={fadeSlide.transition}
                        variants={fadeSlide}
                    >
                        <Select
                            className={styles.countriesSelect}
                            classNames={{ popup: { root: 'customCountryDropdown' } }}
                            prefix={<GlobalOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a', fontSize: 20, marginRight: 10 }} />}
                            size='large'
                            showSearch
                            allowClear
                            placeholder="Start typing and select a country..."
                            optionFilterProp="label"
                            style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}
                            value={state.selectedCountryId}
                            onSearch={(value) => {
                                dispatch({ type: 'SET_COUNTRY_SEARCH', payload: value });
                                dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: true });

                                if (value.trim() === '') {
                                    dispatch({ type: 'SET_COUNTRY_LOADING', payload: false });
                                    setCountryOptions([]);
                                } else {
                                    dispatch({ type: 'SET_COUNTRY_LOADING', payload: true });
                                }

                            }}
                            onChange={(value) => dispatch({ type: 'SET_COUNTRY', payload: value })}
                            onBlur={() => {
                                setCountryOptions([]);
                                dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: false });
                            }}
                            open={state.openCountryDropdown}
                            onOpenChange={(open) => {
                                if (!state.countryLoading) {
                                    dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: open });
                                }
                            }}
                            notFoundContent={
                                state.countryLoading ? (
                                    <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Spin: { colorPrimary: 'green' }
                                                }
                                            }}
                                        >
                                            <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                                                <Spin style={{ transform: 'scale(1.5)' }} size="large" />
                                            </div>
                                        </ConfigProvider>
                                    </div>
                                ) : <Empty style={{ transform: 'scale(1.2)', margin: '2rem 0' }} />
                            }
                            options={countryOptions}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {showTagsSearch && (
                    <motion.div
                        key="categorySearch"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={fadeSlide.transition}
                        variants={fadeSlide}
                    >
                        <Select
                            className={styles.tagsSelect}
                            classNames={{ popup: { root: 'tagsSelectDropdown' } }}
                            prefix={<TagsOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a', marginRight: 10 }} />}
                            mode="multiple"
                            style={{ width: '100%', marginTop: '2rem', textAlign: 'left' }}
                            placeholder="Select Tags"
                            onChange={(value) => {
                                if (value.length <= 20) {
                                    dispatch({ type: 'SET_TAGS', payload: value });
                                }
                            }}
                            options={tags}
                            size='large'
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            value={state.selectedTagIds}
                        />
                    </motion.div>
                )}

            </AnimatePresence>

            {/*  */}

        </div>

    );
};

export default PlaceSearchCard;

// Redesigned PlaceSearchCard (Modern, Clean, Efficient)

// import {
//     Input,
//     Select,
//     Cascader,
//     Button,
//     Typography,
//     Radio,
//     Spin,
//     Empty,
//     ConfigProvider,
// } from "antd";
// import {
//     SearchOutlined,
//     AppstoreOutlined,
//     GlobalOutlined,
//     TagsOutlined,
// } from "@ant-design/icons";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import styles from "./PlaceSearchCard.module.css";

// const PlaceSearchCard = ({
//     state,
//     dispatch,
//     categoryOptions,
//     countryOptions,
//     setCountryOptions,
//     tags,
//     isForAdmin,
//     userFollowingUserName,
//     skipNextSearchRef,
// }) => {
//     const [visible, setVisible] = useState({
//         category: false,
//         country: false,
//         tags: false,
//     });

//     const fade = {
//         initial: { opacity: 0, y: 8 },
//         animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
//         exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
//     };

//     const toggleSection = (key) => {
//         setVisible((prev) => {
//             const newState = !prev[key];
//             if (!newState) {
//                 const hadValue =
//                     key === "category"
//                         ? state.selectedCategoryPath?.length > 0
//                         : key === "country"
//                             ? state.selectedCountryId !== null
//                             : state.selectedTagIds?.length > 0;
//                 dispatch({
//                     type:
//                         key === "category"
//                             ? "SET_CATEGORY"
//                             : key === "country"
//                                 ? "SET_COUNTRY"
//                                 : "SET_TAGS",
//                     payload: key === "country" ? null : [],
//                 });
//                 if (!hadValue) skipNextSearchRef.current = true;
//             }
//             return { ...prev, [key]: newState };
//         });
//     };

//     const handleFilterChange = (e) => {
//         dispatch({ type: "SET_FILTER", payload: e.target.value });
//     };

//     const contextTitle = {
//         Global: "Search Places",
//         UserPlaces: `Search in ${state.filter} Places`,
//         Admin: `Search in ${state.filter} Places`,
//         UserFollowing: `Search in ${userFollowingUserName}'s Places`,
//         FavPlace: "Search in Favorite Places",
//     }[state.searchContext];

//     return (
//         <div className={styles.cardWrapper}>
//             <Typography.Title level={4} className={styles.title}>
//                 <SearchOutlined /> {contextTitle}
//             </Typography.Title>

//             {isForAdmin && (
//                 <ConfigProvider
//                     theme={{
//                         components: {
//                             Radio: {
//                                 borderRadius: 8,
//                                 colorPrimary: "#1890ff",
//                                 buttonSolidCheckedBg: "#1890ff",
//                                 buttonSolidCheckedColor: "#fff",
//                             },
//                         },
//                     }}
//                 >
//                     <Radio.Group
//                         options={[
//                             { label: "Approved", value: "Approved" },
//                             { label: "Unapproved", value: "Unapproved" },
//                             { label: "Recently Deleted", value: "Deleted" },
//                         ]}
//                         value={state.filter}
//                         onChange={handleFilterChange}
//                         buttonStyle="solid"
//                         optionType="button"
//                         className={styles.filterRadio}
//                     />
//                 </ConfigProvider>
//             )}

//             <Input
//                 allowClear
//                 size="large"
//                 placeholder="Search place name..."
//                 prefix={<SearchOutlined />}
//                 value={state.placeName}
//                 onChange={(e) =>
//                     dispatch({ type: "SET_PLACE_NAME", payload: e.target.value })
//                 }
//                 className={styles.inputBox}
//             />

//             <div className={styles.filterButtons}>
//                 <Button
//                     icon={<AppstoreOutlined />}
//                     onClick={() => toggleSection("category")}
//                     className={`${styles.filterBtn} ${visible.category ? styles.active : ""}`}
//                 >
//                     Category
//                 </Button>
//                 <Button
//                     icon={<GlobalOutlined />}
//                     onClick={() => toggleSection("country")}
//                     className={`${styles.filterBtn} ${visible.country ? styles.active : ""}`}
//                 >
//                     Country
//                 </Button>
//                 <Button
//                     icon={<TagsOutlined />}
//                     onClick={() => toggleSection("tags")}
//                     className={`${styles.filterBtn} ${visible.tags ? styles.active : ""}`}
//                 >
//                     Tags
//                 </Button>
//             </div>

//             <AnimatePresence mode="wait">
//                 {visible.category && (
//                     <motion.div {...fade}>
//                         <Cascader
//                             options={categoryOptions}
//                             value={state.selectedCategoryPath}
//                             onChange={(val) =>
//                                 dispatch({ type: "SET_CATEGORY", payload: val })
//                             }
//                             placeholder="Select category/subcategory"
//                             allowClear
//                             changeOnSelect
//                             className={styles.selector}
//                             size="large"
//                         />
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <AnimatePresence mode="wait">
//                 {visible.country && (
//                     <motion.div {...fade}>
//                         <Select
//                             showSearch
//                             allowClear
//                             size="large"
//                             placeholder="Select a country"
//                             options={countryOptions}
//                             value={state.selectedCountryId}
//                             onChange={(val) =>
//                                 dispatch({ type: "SET_COUNTRY", payload: val })
//                             }
//                             onSearch={(val) => {
//                                 dispatch({ type: "SET_COUNTRY_SEARCH", payload: val });
//                                 dispatch({
//                                     type: "SET_COUNTRY_LOADING",
//                                     payload: val.trim() !== "",
//                                 });
//                             }}
//                             notFoundContent={
//                                 state.countryLoading ? (
//                                     <Spin size="large" />
//                                 ) : (
//                                     <Empty />
//                                 )
//                             }
//                             className={styles.selector}
//                         />
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <AnimatePresence mode="wait">
//                 {visible.tags && (
//                     <motion.div {...fade}>
//                         <Select
//                             mode="multiple"
//                             allowClear
//                             showSearch
//                             size="large"
//                             placeholder="Select tags"
//                             options={tags}
//                             value={state.selectedTagIds}
//                             onChange={(val) => {
//                                 if (val.length <= 20)
//                                     dispatch({ type: "SET_TAGS", payload: val });
//                             }}
//                             className={styles.selector}
//                         />
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default PlaceSearchCard;


