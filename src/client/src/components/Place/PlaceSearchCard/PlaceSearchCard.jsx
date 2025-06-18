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
    Radio,
    Avatar
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
    skipNextSearchRef,
    userFollowingProfilePic,
    recordsCount
}) => {

    const [showTagsSearch, setShowTagsSearch] = useState(false);
    const [showCountrySearch, setShowCountrySearch] = useState(false);
    const [showCategorySearch, setShowCategorySearch] = useState(false);

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

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

            <div className={isForAdmin ? styles.adminSearchPanel : styles.searchPanel}>

                <Typography.Title level={3} className={styles.searchTitle}>
                    <SearchOutlined />
                    {state.searchContext === PlaceSearchContext.Global && `Search Places (${recordsCount})`}
                    {state.searchContext === PlaceSearchContext.UserPlaces && `Search in My ${state.filter} Places (${recordsCount})`}
                    {state.searchContext === PlaceSearchContext.Admin && `Search in ${state.filter} Places (${recordsCount})`}
                    {state.searchContext === PlaceSearchContext.UserFollowing && (
                        <>
                            <Avatar size={60} src={userFollowingProfilePic}></Avatar>
                            <span>Search in {userFollowingUserName}'s places ({recordsCount})</span>
                        </>
                    )}
                    {state.searchContext === PlaceSearchContext.FavPlace && `Search in My Favorite Places Collection (${recordsCount})`}
                </Typography.Title>

                {(state.searchContext === PlaceSearchContext.Admin || state.searchContext === PlaceSearchContext.UserPlaces) && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >

                        <ConfigProvider
                            theme={{
                                components: {
                                    Radio: {
                                        colorPrimary: 'green',
                                        colorText: '#f0f0f0',
                                        buttonSolidCheckedBg: 'red',
                                        buttonSolidCheckedColor: 'red',
                                        colorBorder: '#555',
                                        borderRadius: 8,
                                        fontSize: 16,
                                    },
                                },
                            }}
                        >
                            <Radio.Group
                                value={state.filter}
                                onChange={handleFilterChange}
                                name="Sort"
                                className={styles.radioGroup}
                            >
                                {filterOptions.map((opt) => (
                                    <Radio key={opt.value} value={opt.value} className={styles.radioOption}>
                                        {opt.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </ConfigProvider>
                    </div>
                )}

                <Input
                    name="PlaceName"
                    allowClear
                    placeholder="Start typing place name here..."
                    value={state.placeName}
                    onChange={(e) => dispatch({ type: 'SET_PLACE_NAME', payload: e.target.value })}
                    className={styles.placeNameInput}
                />

                <div className={styles.toggleButtonsWrapper}>
                    <Button
                        variant='solid'
                        icon={<AppstoreOutlined />}
                        onClick={toggleCategorySearch}
                        className={`${styles.searchButtonFilter} ${showCategorySearch ? styles.active : ''}`}
                    >
                        Category Search
                    </Button>
                    <Button
                        variant='solid'
                        icon={<GlobalOutlined />}
                        onClick={toggleCountrySearch}
                        className={`${styles.searchButtonFilter} ${showCountrySearch ? styles.active : ''}`}
                    >
                        Country Search
                    </Button>
                    <Button
                        variant='solid'
                        icon={<TagsOutlined />}
                        onClick={toggleTagsSearch}
                        className={`${styles.searchButtonFilter} ${showTagsSearch ? styles.active : ''}`}
                    >
                        Tags Search
                    </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>

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
                                        height: '3rem',
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
                                    classNames={{ popup: { root: 'placeSearchCardCountryDropdown' } }}
                                    prefix={<GlobalOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a', fontSize: 20, marginRight: 10 }} />}
                                    size='large'
                                    showSearch
                                    allowClear
                                    placeholder="Start typing and select a country..."
                                    optionFilterProp="label"
                                    style={{ width: '100%' }}
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
                                    style={{ width: '100%' }}
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

                </div>



                {/*  */}

            </div>
        </div>



    );
};

export default PlaceSearchCard;