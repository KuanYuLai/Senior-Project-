﻿import React, { Component, Fragment } from 'react';
import { Button, Form, Icon, Input, InputNumber, Popconfirm, Radio, Row, Col, Select, Slider } from 'antd';

import Style from '../CSS/NewJob.module.css'

const { Option } = Select;

/* Function to convert a string to proper title case. */
String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

class NewJobForm extends React.Component {
	constructor() {
		super();

		/* This will eventually be replaced with a call to a database.
		 * For now, this file exists locally. */
		var paperDatabase = require('../PaperData/SJA-paper-db-2020-01-20-trim.json');

		/* Initialize all values and populate radios/selects. */
		this.state = {
			paperDatabase: paperDatabase.paperdb,
			coverageVal: 50,
			opticalDensity: 100,
			paperMfrDropdown: this.getMfrDropdown(paperDatabase.paperdb, "manufacturer"),
			paperNameDropdown: this.getMfrDropdown(paperDatabase.paperdb, "productname"),
			paperWeightRadio: this.getRadio(paperDatabase.paperdb, "weightclass"),
			paperTypeRadio: this.getRadio(paperDatabase.paperdb, "papertype"),
			paperSubTypeRadio: this.getRadio(paperDatabase.paperdb, "papersubtype"),
			paperFinishRadio: this.getRadio(paperDatabase.paperdb, "finish"),
		};
	};

	getRadio = (data, key, filter = null) => {
		// Create the select component
		var radio = [];

		var tempArray = data.map(function (e) { return e[key]; }).filter((v, i, a) => a.indexOf(v) === i);

		// Sort the list, except for weights
		if (key !== "weightclass")
			tempArray.sort();

		for (let i = 0; i < tempArray.length; i++) {
			var text = tempArray[i];
			var disabled = false;

			if (filter !== null)
				if (filter.indexOf(text) === -1)
					disabled = true;

			radio.push(<Radio.Button disabled={disabled} key={i} value={text}>{text}</Radio.Button>);
		}

		return radio;
	}

	getMfrDropdown = (data, key) => {
		// Create the select component
		var dropdown = [];
		var mfrNames = [];

		// Get all names
		for (let i = 0; i < data.length; i++) {
			mfrNames.push(data[i][key]);
		}

		// Filter list for unique names only, then sort it alphabetically
		mfrNames = mfrNames.filter((v, i, a) => a.indexOf(v) === i).sort();

		// Create the dropdown for the Select using the list of names
		for (let j = 0; j < mfrNames.length; j++) {
			dropdown.push(<Option key={mfrNames[j]}>{mfrNames[j]}</Option>);
		}

		return dropdown;

		/* This is an example of creating the options for a dropdown menu based off
		 * of data fetched via an API call. Leaving this here as an example.
		 * 
		// Fetch the degree table to get values for select component
		fetch(serverURL + "get_table/degree", {
			method: "GET",
			headers: {
				"Accept": "application/json"
			}
		}).then((res) => {
			res.json().then((data) => {
				// Create the select component
				var dropdown = [];

				for (let i = 0; i < data.length; i++) {
					var text = data[i].degreesID + " - " + data[i].degreeCombination;
					dropdown.push(<Option key={data[i].degreesID}>{text}</Option>);
				}
				this.setState({ degreeDropdown: dropdown })
			});
		}).catch(err => err);
		*/
	};

	/* Called when the coverage value is changed. */
	onCoverageValChange = val => {
		const { setFieldsValue } = this.props.form;

		setFieldsValue({
			maxCoverage: val,
		});

		this.setState({
			coverageVal: val,
		});
	};

	/* Called when the optical density value is changed. */
	onODValChange = val => {
		const { setFieldsValue } = this.props.form;

		// Set a minimum value
		if (val < 50)
			val = 50;

		setFieldsValue({
			opticalDensity: val,
		});

		this.setState({
			opticalDensity: val,
		});
	};

	/* Clear the field value for paper name in case mfr is changed. * /
	setFieldsValue({
		productname: null,
		weightclass: null,
		papertype: null,
		papersubtype: null,
		finish: null,
	});
	*/

	onPaperMfrChange = val => {
		const { paperDatabase } = this.state;

		var dropdown = [];
		var paperNames = [];

		/* Grab all instances that contain the manufacturer selected in the Mfr dropdown. */
		var selectedMfr = this.state.paperDatabase.filter((e) => e.manufacturer === val);

		/* Grab all of the productnames within the list of objects. */
		for (let i = 0; i < selectedMfr.length; i++) {
			paperNames.push(selectedMfr[i].productname);
		}

		/* Filter the list of productnames to remove duplicates. */
		paperNames = paperNames.filter((v, i, a) => a.indexOf(v) === i);

		/* Create the paper name dropdown list using the filtered list of productnames. */
		for (let j = 0; j < paperNames.length; j++) {
			dropdown.push(<Option key={paperNames[j]}>{paperNames[j]}</Option>);
		}

		this.setState({
			paperNameDropdown: dropdown,
			paperTypeRadio: this.getRadio(paperDatabase, "papertype"),
			paperSubTypeRadio: this.getRadio(paperDatabase, "papersubtype"),
			paperWeightRadio: this.getRadio(paperDatabase, "weightclass"),
			paperFinishRadio: this.getRadio(paperDatabase, "finish"),
		});
	}

	onPaperNameChange = val => {
		const { paperDatabase } = this.state;
		const { setFieldsValue } = this.props.form;

		var selectedPaper = this.state.paperDatabase.filter((e) => e.productname === val);

		var paperTypes = [];
		var paperSubTypes = [];
		var paperWeights = [];
		var paperFinishes = [];

		/* Grab all of the types/subtypes/weights/finishes within the list of objects. */
		for (let i = 0; i < selectedPaper.length; i++) {
			paperTypes.push(selectedPaper[i].papertype);
			paperSubTypes.push(selectedPaper[i].papersubtype);
			paperWeights.push(selectedPaper[i].weightclass);
			paperFinishes.push(selectedPaper[i].finish);
		}

		/* Filter the lists of types/subtypes/weights/finishes to remove duplicates. Sort all alphabetically except for weights */
		paperTypes = paperTypes.filter((v, i, a) => a.indexOf(v) === i);
		paperSubTypes = paperSubTypes.filter((v, i, a) => a.indexOf(v) === i);
		paperWeights = paperWeights.filter((v, i, a) => a.indexOf(v) === i);
		paperFinishes = paperFinishes.filter((v, i, a) => a.indexOf(v) === i);

		/* Rebuild the radios for types/subtypes/weights/finishes to disable options that are not present in data for the given productname. */
		this.setState({
			paperTypeRadio: this.getRadio(paperDatabase, "papertype", paperTypes),
			paperSubTypeRadio: this.getRadio(paperDatabase, "papersubtype", paperSubTypes),
			paperWeightRadio: this.getRadio(paperDatabase, "weightclass", paperWeights),
			paperFinishRadio: this.getRadio(paperDatabase, "finish", paperFinishes),
		});

		setFieldsValue({
			weightclass: null,
			papertype: null,
			papersubtype: null,
			finish: null,
		});
	};

	/*
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * Continue working on this function.
	 */
	resetPaperName = () => {
		this.props.form.resetFields("productname");
	}

	/* Resets all the paper selection radio disabled values. */
	resetPaperSelectionRadio = () => {
		let { paperDatabase } = this.state;

		this.setState({
			paperTypeRadio: this.getRadio(paperDatabase, "papertype"),
			paperSubTypeRadio: this.getRadio(paperDatabase, "papersubtype"),
			paperWeightRadio: this.getRadio(paperDatabase, "weightclass"),
			paperFinishRadio: this.getRadio(paperDatabase, "finish"),
		});
	}

	/* Resets all form fields for paper selection. */
	paperReset = () => {
		this.props.form.resetFields(["manufacturer", "productname", "papertype", "papersubtype", "weightclass", "finish"]);
		this.resetPaperSelectionRadio();
	}

	/* Resets the max coverage and optical density sliders. */
	sliderReset = () => {
		this.setState({
			coverageVal: 50,
			opticalDensity: 100,
		});
	}

	infoReset = () => {
		this.props.form.resetFields(["jobName", "ruleset", "maxCoverage", "opticalDensity"]);
		this.sliderReset();
	}

	/* Resets the entire form. */
	formReset = () => {
		this.props.form.resetFields();
		this.resetPaperSelectionRadio();
		this.sliderReset();
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};

	render() {
		const { coverageVal, opticalDensity } = this.state;
		const { getFieldDecorator } = this.props.form;

		const paperFormItemLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 21 },
		}

		return (
			<div className={Style.newJobFormContainer}>
				<h1>New Job</h1>
				<p>
					Enter the settings for the job.<br />
					Click Submit to pass the settings to the rules engine.
				</p>

				<br />

				<Form layout="vertical" onSubmit={this.handleSubmit} className={Style.newJobForm}>
					<div className={Style.formGeneralInfo}>
						<div style={{ display: 'inline-block' }}>
							<h5>
								General Info
								<Button className={Style.resetButton} onClick={() => this.infoReset()} type="default" >
									<Icon style={{ position: 'relative', bottom: 3 }} type="undo" />
									Reset
								</Button>
							</h5>
						</div>
						<Row gutter={20}>
							<Col span={12}>
								<Form.Item label="Job Name:" style={{ marginBottom: -5 }}>
									{getFieldDecorator('jobName', {
										rules: [{ required: true, message: 'Please input a job name' }],
										initialValue: "Setting Advice",
									})(
										<Input
											className={Style.formItemInput}
											prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
										/>,
									)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Ruleset:" style={{ marginBottom: -5 }}>
									{getFieldDecorator('ruleset', {
										rules: [{ required: true, message: 'Please choose a ruleset' }],
										initialValue: "Default",
									})(
										<Select className={Style.formItemInput}>
											<Option value="Default">Default</Option>
											<Option value="Ruleset B">Ruleset B</Option>
											<Option value="Ruleset C">Ruleset C</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Form.Item style={{ marginBottom: -5 }} label="PDF Max Coverage Percentage:">
							{getFieldDecorator('maxCoverage', {
								rules: [{ required: true, message: 'Please input max coverage' }],
								initialValue: 50,
							})(
								<div style={{ display: 'flex' }} >
									<Slider
										className={Style.formItemInput}
										style={{ width: 'calc(100% - 100px)' }}
										min={0}
										max={100}
										onChange={this.onCoverageValChange}
										value={typeof coverageVal === 'number' ? coverageVal : 0}
									/>
									<InputNumber
										className={Style.formItemInputNumber}
										style={{ width: 72 }}
										min={1}
										max={100}
										formatter={value => `${value}%`}
										value={coverageVal}
										onChange={this.onCoverageValChange}
									/>
								</div>
							)}
						</Form.Item>
						<Form.Item label="Optical Density:">
							{getFieldDecorator('opticalDensity', {
								rules: [{ required: true, message: 'Please input max coverage' }],
								initialValue: 50,
							})(
								<div style={{ display: 'flex' }} >
									<Slider
										className={Style.formItemInput}
										style={{ width: 'calc(100% - 100px)' }}
										step={5}
										min={0}
										max={100}
										onChange={this.onODValChange}
										value={typeof opticalDensity === 'number' ? opticalDensity : 0}
									/>
									<InputNumber
										className={Style.formItemInputNumber}
										style={{ width: 72 }}
										step={5}
										min={50}
										max={100}
										formatter={value => `${value}%`}
										value={opticalDensity}
										onChange={this.onODValChange}
									/>
								</div>
							)}
						</Form.Item>
					</div>

					<div style={{ display: 'inline-block' }}>
						<h5>
							Paper Selection
							<Button className={Style.resetButton} onClick={() => this.paperReset()} type="default" >
								<Icon style={{ position: 'relative', bottom: 3 }} type="undo" />
								Reset
							</Button>
						</h5>
					</div>
					<Form.Item label="Mfr:" {...paperFormItemLayout} style={{ marginBottom: 0 }}>
						{getFieldDecorator('manufacturer', {
							rules: [{ required: true, message: 'Please select a manufacturer' }],
						})(
							<Select
								className={Style.formItemPaper}
								style={{ maxWidth: 330 }}
								onChange={this.onPaperMfrChange}
								placeholder={<span><Icon type="search" className={Style.iconAdjust} />&nbsp;Select a manufacturer</span>}
								showSearch
							>
								{this.state.paperMfrDropdown}
							</Select>
						)}
					</Form.Item>
					<Form.Item label="Name:" {...paperFormItemLayout} style={{ marginBottom: 0 }}>
						{getFieldDecorator('productname', {
							rules: [{ required: true, message: 'Please select a paper' }],
						})(
							<Select
								className={Style.formItemPaper}
								style={{ maxWidth: 330 }}
								onChange={this.onPaperNameChange}
								placeholder={<span><Icon type="search" className={Style.iconAdjust} />&nbsp;Select a paper</span>}
								showSearch
							>
								{this.state.paperNameDropdown}
							</Select>
						)}
					</Form.Item>

					<Form.Item label="Type:" {...paperFormItemLayout} style={{ marginBottom: 0 }}>
						{getFieldDecorator('papertype', {
							rules: [{ required: true, message: 'Please choose a paper type' }],
						})(
							<Radio.Group className={Style.formItemPaper} onChange={this.resetPaperName}>
								{this.state.paperTypeRadio}
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item label="Sub-Type:" {...paperFormItemLayout} style={{ marginBottom: 0 }}>
						{getFieldDecorator('papersubtype')(
							<Radio.Group className={Style.formItemPaper} onChange={this.resetPaperName}>
								{this.state.paperSubTypeRadio}
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item label="Weight:" {...paperFormItemLayout} style={{ marginBottom: 0 }}>
						{getFieldDecorator('weightclass', {
							rules: [{ required: true, message: 'Please choose a weight class' }],
						})(
							<Radio.Group className={Style.formItemPaper} onChange={this.resetPaperName}>
								{this.state.paperWeightRadio}
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item label="Finish:" {...paperFormItemLayout} style={{ marginBottom: 0 }}>
						{getFieldDecorator('finish', {
							rules: [{ required: true, message: 'Please choose a finish' }],
						})(
							<Radio.Group className={Style.formItemPaper} onChange={this.resetPaperName}>
								{this.state.paperFinishRadio}
							</Radio.Group>
						)}
					</Form.Item>

					<br />

					<div className={Style.formButtons}>
						<Popconfirm
							title="Are you sure reset the form?"
							placement="top"
							onConfirm={() => this.formReset()}
						>
							<Button ghost type="danger">
								<Icon style={{ position: 'relative', bottom: 3 }} type="undo" />
								Reset Form
							</Button>
						</Popconfirm>
						<Button type="primary" onClick={this.handleSubmit}>
							Submit
						</Button>
					</div>
				</Form>
			</div>
		);
	}
}

const NewJob = Form.create({ name: 'new-job' })(NewJobForm);

export { NewJob };